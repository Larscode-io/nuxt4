import { FastifyPluginAsync } from 'fastify';
import { DEFAULT_LANGUAGE, Languages } from '../../constants';
import { PbcpWebsite } from '../pages.type';
import { getPublicPathPDFFileGeneralPressRelease } from '../../utils';


// fastify.get('/general-press-releases', generalPressReleases);
// eslint-disable-next-line require-await
export const generalPressReleasePlugin: FastifyPluginAsync = async (app) => {
  app.get('/general-press-releases', generalPressReleases)
}

async function generalPressReleases(request) {
  const { lang = DEFAULT_LANGUAGE, withArchive = true } = request.query;

  /**
   Old query:
   $query_pbcp = "SELECT * FROM pbcp_website WHERE title_" . substr($lng, 0, 1) . " IS NOT NULL " . (isset($_GET['archive_pbcp']) ? "" : "AND archive IS NULL") . " AND offline IS NULL ORDER BY _k1_pbcp_id DESC";
   */

  const titleByLang = {
    [Languages.DUTCH]: 'title_n',
    [Languages.FRENCH]: 'title_f',
    [Languages.ENGLISH]: 'title_e',
    [Languages.GERMAN]: 'title_d',
  };
  const titleDbKey = titleByLang[lang];

  const introByLang = {
    [Languages.DUTCH]: 'intro_n',
    [Languages.FRENCH]: 'intro_f',
    [Languages.ENGLISH]: 'intro_e',
    [Languages.GERMAN]: 'intro_d',
  };
  const introDbKey = introByLang[lang];

  const fileExtensionByLang = {
    [Languages.DUTCH]: 'n.pdf',
    [Languages.FRENCH]: 'f.pdf',
    [Languages.ENGLISH]: 'e.pdf',
    [Languages.GERMAN]: 'd.pdf',
  };

  // Query with the archive
  // @ts-ignore
  let query = request
    .db<PbcpWebsite>('pbcp_website')
    .whereNotNull(titleDbKey)
    .whereNull('offline')
    .orderBy('_k1_pbcp_id', 'desc');

  if (withArchive === 'false') {
    // Query without the archive
    query = query.whereNull('archive');
  }

  // console.log('query----', query.toString());
  const records = await query;

  const views = records?.map((record: PbcpWebsite) => {
    const fileName = record.filename.replace(
      '.pdf',
      fileExtensionByLang[lang]
    );
    return {
      id: record._k1_pbcp_id,
      title: record[titleDbKey],
      description: record[introDbKey],
      fileName,
      filePath: getPublicPathPDFFileGeneralPressRelease(lang, fileName),
      archived: withArchive !== 'false',
    };
  });
  return views;
}
