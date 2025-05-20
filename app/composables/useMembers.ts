import { ref, computed, onMounted } from 'vue'
import type { Member, Role } from '@types/members'

type RawMember = Partial<Member> & { name: string } // alleen wat zeker is

export function useMembers(locale: Ref<string>) {
  const parseDate = (d: string | null): Date | null => d ? new Date(d.split('.').reverse().join('-')) : null

  // Nuxt Content merges the original JSON content (from `meta.body`) with extra metadata fields
  // such as `id`, `path`, and inferred values directly onto the root object.
  // This means that missing properties in the original .json file (e.g. `isAlive`)
  // may appear as `undefined` or be silently added via type merging or Nuxt's hydration.
  // In this case, `isAlive` is added as false to the root object but not in the original JSON.
  //
  // To reliably check for truly missing fields — especially during data validation or migration —
  // we extract and inspect `entry.meta.body`, which contains the raw content
  // exactly as it appears in the source .json file.
  // todo: check if this works better on the server side so we can drop the meta stuff
  //
  // This ensures we can correctly detect when fields like `isAlive` are not present at all.

  function transformMember(entry: any): Member {
    // we use the raw entry because isAlive is somethimes at top level while missing in the real .json and in meta
    const raw = entry?.meta?.body || entry // fallback if meta is missing

    const mostRecentRoleDate = getMostRecentRole(raw.roles ?? [])?.startDate ?? '01.01.1990'

    return {
      ...raw,
      usStartDate: parseDate(mostRecentRoleDate),
      isAlive: raw.isAlive ?? true,
      // inherit id/slug/etc. from enriched entry if needed
      slug: raw.slug || entry.slug,
      lang: raw.lang || entry.lang,
      name: raw.name || entry.name,
    } as Member
  }

  const { data: membersResponse } = useAsyncData<Member[]>(
    'judges_active',
    () => queryCollection('collection_member_active')
      .all()
      // for debugging: log the raw members
      // .then((rawMembers: RawMember[]) => {
      //   console.log('Raw members:', rawMembers[0])
      //   return rawMembers
      // })
      .then(members => members.map(member => transformMember(member))),
  )

  const { data: membersResponse_inactive } = useAsyncData<Member[]>(
    'judges_inactive',
    () => queryCollection('collection_member_inactive')
      .all()
      .then(members => members.map(member => transformMember(member))),
  )

  function getMostRecentRole(roles: Role[] | Role) {
    if (!Array.isArray(roles)) {
    // If it's a single role object, wrap it in an array
      if (roles && typeof roles === 'object' && roles.role) {
        roles = [roles]
      }
      else {
        return null
      }
    }

    const activeRoles = roles.filter(r => !r.endDate)
    const pastRoles = roles.filter(r => r.endDate)

    // Sort descending by startDate
    if (activeRoles.length > 0) {
      return activeRoles.sort((a, b) =>
        (parseDate(b.startDate)?.getTime() ?? 0) - (parseDate(a.startDate)?.getTime() ?? 0),
      )[0]
    }

    // Else: fallback to latest past role
    return pastRoles.sort((a, b) => {
      const dateA = parseDate(a.endDate)?.getTime() ?? 0
      const dateB = parseDate(b.endDate)?.getTime() ?? 0
      return dateB - dateA
    })[0] || null
  }

  const groupedMembers = computed(() => {
    return (membersResponse.value || []).reduce((acc: Record<string, Member[]>, member: Member) => {
      const mostRecentRole = getMostRecentRole(member.roles ?? [])
      const roles = [mostRecentRole?.role]
      if (mostRecentRole?.startDate === null && mostRecentRole?.endDate === null) {
        // ENABLE IN PRODUCTION
        // console.error(`Member ${member.name} has no startDate or endDate in roles:`, member.roles)
      }

      roles.forEach((role: string | undefined) => {
        if (role) {
          if (!acc[role]) acc[role] = []
          // this is a debug line for the fact that the API returns the wrong isAlive value
          // if (member.name === 'Ann-Sophie VANDAELE') {
          //   console.info(`Member ${member.name} is ${member.isAlive ? 'alive' : 'not alive'} in groupedMembers`)
          // }
          acc[role].push(
            { ...member,
              _recentRoleStartDate: mostRecentRole?.startDate,
            })
        }
      })
      return acc
    }, {})
  })

  const groupedMembersHistoric = computed(() => {
    const allMembers = [
      ...(membersResponse_inactive.value || []),
      ...(membersResponse.value || []),
    ]
    return allMembers.reduce((acc: Record<string, Member[]>, member: Member) => {
      (member.roles ?? []).forEach((roleObj: Role) => {
        if (roleObj && typeof roleObj === 'object' && roleObj.role) {
          const roleName = roleObj.role
          if (!acc[roleName]) acc[roleName] = []
          acc[roleName].push({
            name: member.name,
            lang: member.lang,
            isAlive: member.isAlive,
            // isAlive: member.isAlive || true,
            ...roleObj,
          })
        }
      })
      return acc
    }, {})
  })

  function getMembers2Columns(members: Member[], localeValue: string) {
    const left: Member[] = []
    const right: Member[] = []

    members.forEach((member) => {
      if (['fr', 'de'].includes(localeValue)) {
        // Inverse: fr on left, nl/en on right
        if (member.lang === 'fr') {
          left.push(member)
        }
        else if (member.lang === 'nl' || member.lang === 'en') {
          right.push(member)
        }
      }
      else {
        // Default: nl/en on left, fr on right
        if (member.lang === 'nl' || member.lang === 'en') {
          left.push(member)
        }
        else if (member.lang === 'fr') {
          right.push(member)
        }
      }
    })

    return { left, right }
  }

  function sortMembersByStartDate(members: Member[]): Member[] {
    return [...members].sort((a, b) => {
      const dateA = a.usStartDate ? new Date(a.usStartDate).getTime() : 0
      const dateB = b.usStartDate ? new Date(b.usStartDate).getTime() : 0
      return dateA - dateB
    })
  }

  const judgeMembersRaw = computed<Member[]>(() => sortMembersByStartDate(groupedMembers.value['judge'] || []))
  const judgeMembers2ColumnsLang = computed(() => getMembers2Columns(judgeMembersRaw.value, locale.value))

  const presidentMembersRaw = computed<Member[]>(() => groupedMembers.value['president'] || [])
  const presidentMembers2ColumnsLang = computed(() => getMembers2Columns(presidentMembersRaw.value, locale.value))

  const combinedPresidentsAndJudges2Columns = computed(() => {
    const left = [...presidentMembers2ColumnsLang.value.left, ...judgeMembers2ColumnsLang.value.left]
    const right = [...presidentMembers2ColumnsLang.value.right, ...judgeMembers2ColumnsLang.value.right]
    return { left, right }
  })

  const officeStaffMembersRaw = computed<Member[]>(() => sortMembersByStartDate(groupedMembers.value['legalSecretaries'] || []))
  const officeStaffMembers2ColumnsLang = computed(() => getMembers2Columns(officeStaffMembersRaw.value, locale.value))

  const registrarMembersRaw = computed<Member[]>(() => sortMembersByStartDate(groupedMembers.value['registrars'] || []))
  const registrarMembers2ColumnsLang = computed(() => getMembers2Columns(registrarMembersRaw.value, locale.value))

  // interleave with flatMap to keep legacy design in the members page template (for now)
  const judgeMembers = computed(() => combinedPresidentsAndJudges2Columns.value.left.flatMap((v, i) => [v, combinedPresidentsAndJudges2Columns.value.right[i]]))
  const officeStaffMembers = computed(() => officeStaffMembers2ColumnsLang.value.left.flatMap((v, i) => [v, officeStaffMembers2ColumnsLang.value.right[i]]))
  const registrarMembers = computed(() => registrarMembers2ColumnsLang.value.left.flatMap((v, i) => [v, registrarMembers2ColumnsLang.value.right[i]]))

  const judgeMembersHistoric = computed<Member[]>(() => sortMembersByStartDate(groupedMembersHistoric.value['judge'] || []))
  const presidentMembersHistoric = computed<Member[]>(() => sortMembersByStartDate(groupedMembersHistoric.value['president'] || []))
  const registrarMembersHistoric = computed<Member[]>(() => sortMembersByStartDate(groupedMembersHistoric.value['registrars'] || []))
  const officeStaffMembersHistoric = computed<Member[]>(() => sortMembersByStartDate(groupedMembersHistoric.value['legalSecretaries'] || []))
  const aliveNonActiveJudgeMembersHistoric = computed<Member[]>(
    () => {
      const activeJudgeNames = new Set((judgeMembersRaw.value || []).map(member => member.name))
      const historicPresidentNames = new Set((presidentMembersHistoric.value || []).map(member => member.name))
      return judgeMembersHistoric.value.filter(
        member => member.isAlive && !activeJudgeNames.has(member.name) && !historicPresidentNames.has(member.name),
      )
    },
  )
  const aliveNonActivePresidentMembersHistoric = computed<Member[]>(
    () => {
      const activePresidentNames = new Set((presidentMembersRaw.value || []).map(member => member.name))
      const filtered = presidentMembersHistoric.value.filter(
        member => member.isAlive && !activePresidentNames.has(member.name),
      )
      // Remove duplicates by member name because some were 2x president
      const seen = new Set<string>()
      return filtered.filter((member) => {
        if (seen.has(member.name)) return false
        seen.add(member.name)
        return true
      })
    },
  )
  const aliveNonActiveRegistrarMembersHistoric = computed<Member[]>(
    () => {
      const activeRegistrarNames = new Set((registrarMembersRaw.value || []).map(member => member.name))
      return registrarMembersHistoric.value.filter(
        member => member.isAlive && !activeRegistrarNames.has(member.name),
      )
    },
  )
  const aliveNonActiveOfficeStaffMembersHistoric = computed<Member[]>(
    () => {
      const activeOfficeStaffNames = new Set((officeStaffMembersRaw.value || []).map(member => member.name))
      return officeStaffMembersHistoric.value.filter(
        member => member.isAlive && !activeOfficeStaffNames.has(member.name),
      )
    },
  )
  onMounted(() => {
    // console.log('RAW:', membersResponse.value)
    // console.log('Members Response grouped:', groupedMembers.value)
    // console.log('Members Response inactive:', membersResponse_inactive.value)
    // console.log('President Members historic:', presidentMembersHistoric.value)
    // console.log('Judge Members historic:', judgeMembersHistoric.value)

    // console.log('aliveNonActiveJudgeMembersHistoric:', aliveNonActiveJudgeMembersHistoric.value)
    // console.log('aliveNonActivePresidentMembersHistoric:', aliveNonActivePresidentMembersHistoric.value)
    // console.log('aliveNonActiveRegistrarMembersHistoric:', aliveNonActiveRegistrarMembersHistoric.value)
    // console.log('aliveNonActiveOfficeStaffMembersHistoric:', aliveNonActiveOfficeStaffMembersHistoric.value)
  })

  return {
    judgeMembers,
    officeStaffMembers,
    getMostRecentRole,
    registrarMembers,
    judgeMembersHistoric,
    presidentMembersHistoric,
    aliveNonActiveJudgeMembersHistoric,
    aliveNonActivePresidentMembersHistoric,
    aliveNonActiveRegistrarMembersHistoric,
    aliveNonActiveOfficeStaffMembersHistoric,
  }
}
