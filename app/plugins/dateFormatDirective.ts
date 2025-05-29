// plugins/dateFormatDirective.ts
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('date-format', {
    mounted: (el) => {
      const input = el.tagName === 'INPUT' ? el : el.querySelector('input')
      if (!input) return

      input.addEventListener('input', function (e) {
        let value = e.target.value.replace(/\D/g, '') // Remove non-digits

        // Format as DD/MM/YYYY
        if (value.length > 0) {
          // Handle day
          if (value.length > 2) {
            // Check if day is valid (01-31)
            let day = parseInt(value.substring(0, 2))
            if (day > 31) day = 31
            if (day < 1) day = 1
            value = day.toString().padStart(2, '0') + value.substring(2)
          }

          // Add first slash after day
          if (value.length > 2) {
            value = value.substring(0, 2) + '/' + value.substring(2)
          }

          // Handle month
          if (value.length > 5) {
            // Check if month is valid (01-12)
            let month = parseInt(value.substring(3, 5))
            if (month > 12) month = 12
            if (month < 1) month = 1
            value = value.substring(0, 3) + month.toString().padStart(2, '0') + value.substring(5)
          }

          // Add second slash after month
          if (value.length > 5) {
            value = value.substring(0, 5) + '/' + value.substring(5)
          }

          // Limit year to 4 digits
          if (value.length > 10) {
            value = value.substring(0, 10)
          }
        }

        // Update the input value
        e.target.value = value

        // Trigger v-model update
        input.dispatchEvent(new Event('input', { bubbles: true }))
      })

      // Handle pasting
      input.addEventListener('paste', function (e) {
        e.preventDefault()
        const paste = (e.clipboardData || window.clipboardData).getData('text')
        const digits = paste.replace(/\D/g, '')

        // Simulate typing the digits
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
          window.HTMLInputElement.prototype, 'value',
        ).set
        nativeInputValueSetter.call(input, digits)
        input.dispatchEvent(new Event('input', { bubbles: true }))
      })
    },
  })
})
