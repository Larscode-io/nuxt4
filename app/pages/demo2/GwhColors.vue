<template>
  <div>
    <div>
      <h3 style="font-family: sans-serif; font-weight: bold; margin-bottom: 1rem;">
        Semantic Vuetify Colors
      </h3>
      <div style="display: flex; gap: 1rem; flex-wrap: nowrap;">
        <div style="width: 150px; border-radius: 4px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.2);">
          <div style="height: 100px; background: rgb(var(--v-theme-primary));" />
          <div style="padding: 0.5rem; background: #fff;">
            <span style="font-weight: bold; display: block; margin-bottom: 0.25rem;">Vuetify Primary</span>
            <span style="font-family: monospace; display: block; margin-bottom: 0.25rem; color: #555;">rgb(var(--v-theme-primary))</span>
            <span style="font-size: 0.875rem; color: #666;">Primary color from Vuetify theme</span>
          </div>
        </div>
        <div style="width: 150px; border-radius: 4px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.2);">
          <div style="height: 100px; background: rgb(var(--v-theme-secondary));" />
          <div style="padding: 0.5rem; background: #fff;">
            <span style="font-weight: bold; display: block; margin-bottom: 0.25rem;">Vuetify Secondary</span>
            <span style="font-family: monospace; display: block; margin-bottom: 0.25rem; color: #555;">rgb(var(--v-theme-secondary))</span>
            <span style="font-size: 0.875rem; color: #666;">Secondary color from Vuetify theme</span>
          </div>
        </div>
        <div style="width: 150px; border-radius: 4px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.2);">
          <div style="height: 100px; background: rgb(var(--v-theme-accent));" />
          <div style="padding: 0.5rem; background: #fff;">
            <span style="font-weight: bold; display: block; margin-bottom: 0.25rem;">Vuetify Accent</span>
            <span style="font-family: monospace; display: block; margin-bottom: 0.25rem; color: #555;">rgb(var(--v-theme-accent))</span>
            <span style="font-size: 0.875rem; color: #666;">Accent color from Vuetify theme</span>
          </div>
        </div>
        <div style="width: 150px; border-radius: 4px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.2);">
          <div style="height: 100px; background: rgb(var(--v-theme-error));" />
          <div style="padding: 0.5rem; background: #fff;">
            <span style="font-weight: bold; display: block; margin-bottom: 0.25rem;">Vuetify Error</span>
            <span style="font-family: monospace; display: block; margin-bottom: 0.25rem; color: #555;">rgb(var(--v-theme-error))</span>
            <span style="font-size: 0.875rem; color: #666;">Error color from Vuetify theme</span>
          </div>
        </div>
        <div style="width: 150px; border-radius: 4px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.2);">
          <div style="height: 100px; background: rgb(var(--v-theme-info));" />
          <div style="padding: 0.5rem; background: #fff;">
            <span style="font-weight: bold; display: block; margin-bottom: 0.25rem;">Vuetify Info</span>
            <span style="font-family: monospace; display: block; margin-bottom: 0.25rem; color: #555;">rgb(var(--v-theme-info))</span>
            <span style="font-size: 0.875rem; color: #666;">Info color from Vuetify theme</span>
          </div>
        </div>
        <div style="width: 150px; border-radius: 4px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.2);">
          <div style="height: 100px; background: rgb(var(--v-theme-success));" />
          <div style="padding: 0.5rem; background: #fff;">
            <span style="font-weight: bold; display: block; margin-bottom: 0.25rem;">Vuetify Success</span>
            <span style="font-family: monospace; display: block; margin-bottom: 0.25rem; color: #555;">rgb(var(--v-theme-success))</span>
            <span style="font-size: 0.875rem; color: #666;">Success color from Vuetify theme</span>
          </div>
        </div>
        <div style="width: 150px; border-radius: 4px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.2);">
          <div style="height: 100px; background: rgb(var(--v-theme-warning));" />
          <div style="padding: 0.5rem; background: #fff;">
            <span style="font-weight: bold; display: block; margin-bottom: 0.25rem;">Vuetify Warning</span>
            <span style="font-family: monospace; display: block; margin-bottom: 0.25rem; color: #555;">rgb(var(--v-theme-warning))</span>
            <span style="font-size: 0.875rem; color: #666;">Warning color from Vuetify theme</span>
          </div>
        </div>
      </div>
    </div>
    <h3 style="font-family: sans-serif; font-weight: bold; margin-bottom: 1rem;">
      Custom Colors
    </h3>
    <div style="display: flex; gap: 1rem; font-family: sans-serif; flex-wrap: wrap;">
      <!-- Existing Core Palette -->
      <div style="width: 150px; border-radius: 4px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.2);">
        <div style="height: 100px; background: #043C72;" />
        <div style="padding: 0.5rem; background: #fff;">
          <span style="font-weight: bold; display: block; margin-bottom: 0.25rem;">Logo Color (Primary)</span>
          <span style="font-family: monospace; display: block; margin-bottom: 0.25rem; color: #555;">#043C72</span>
          <span style="font-size: 0.875rem; color: #666;">Brand identity, headers, primary nav</span>
        </div>
      </div>

      <div style="width: 150px; border-radius: 4px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.2);">
        <div style="height: 100px; background: #0065CA;" />
        <div style="padding: 0.5rem; background: #fff;">
          <span style="font-weight: bold; display: block; margin-bottom: 0.25rem;">Indigo (Secondary)</span>
          <span style="font-family: monospace; display: block; margin-bottom: 0.25rem; color: #555;">#0065CA</span>
          <span style="font-size: 0.875rem; color: #666;">Secondary buttons, links, icons</span>
        </div>
      </div>

      <!-- Indigo States -->
      <div style="width: 150px; border-radius: 4px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.2);">
        <div style="height: 100px; background: rgba(0, 101, 202, 0.14);" />
        <div style="padding: 0.5rem; background: #fff;">
          <span style="font-weight: bold; display: block; margin-bottom: 0.25rem;">Indigo Extra Light</span>
          <span style="font-family: monospace; display: block; margin-bottom: 0.25rem; color: #555;">rgba(0,101,202,0.14)</span>
          <span style="font-size: 0.875rem; color: #666;">Subtle overlays, hover backgrounds</span>
        </div>
      </div>

      <div style="width: 150px; border-radius: 4px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.2);">
        <div style="height: 100px; background: rgba(0, 101, 202, 0.8);" />
        <div style="padding: 0.5rem; background: #fff;">
          <span style="font-weight: bold; display: block; margin-bottom: 0.25rem;">Indigo Light</span>
          <span style="font-family: monospace; display: block; margin-bottom: 0.25rem; color: #555;">rgba(0,101,202,0.8)</span>
          <span style="font-size: 0.875rem; color: #666;">Active/pressed states</span>
        </div>
      </div>

      <div style="width: 150px; border-radius: 4px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.2);">
        <div style="height: 100px; background: rgba(0, 101, 202, 0.7);" />
        <div style="padding: 0.5rem; background: #fff;">
          <span style="font-weight: bold; display: block; margin-bottom: 0.25rem;">Indigo Medium Light</span>
          <span style="font-family: monospace; display: block; margin-bottom: 0.25rem; color: #555;">rgba(0,101,202,0.7)</span>
          <span style="font-size: 0.875rem; color: #666;">Hover/selected states</span>
        </div>
      </div>

      <!-- Sky Blue -->
      <div style="width: 150px; border-radius: 4px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.2);">
        <div style="height: 100px; background: #00AAE7;" />
        <div style="padding: 0.5rem; background: #fff;">
          <span style="font-weight: bold; display: block; margin-bottom: 0.25rem;">Sky Blue (Tertiary)</span>
          <span style="font-family: monospace; display: block; margin-bottom: 0.25rem; color: #555;">#00AAE7</span>
          <span style="font-size: 0.875rem; color: #666;">Info highlights, badges</span>
        </div>
      </div>

      <div style="width: 150px; border-radius: 4px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.2);">
        <div style="height: 100px; background: rgba(0, 170, 231, 0.24);" />
        <div style="padding: 0.5rem; background: #fff;">
          <span style="font-weight: bold; display: block; margin-bottom: 0.25rem;">Sky Blue Extra Light</span>
          <span style="font-family: monospace; display: block; margin-bottom: 0.25rem; color: #555;">rgba(0,170,231,0.24)</span>
          <span style="font-size: 0.875rem; color: #666;">Background tints, subtle panels</span>
        </div>
      </div>

      <!-- Rajah Yellow Accent -->
      <div style="width: 150px; border-radius: 4px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.2);">
        <div style="height: 100px; background: #FCBF60;" />
        <div style="padding: 0.5rem; background: #fff;">
          <span style="font-weight: bold; display: block; margin-bottom: 0.25rem;">Rajah Yellow (Accent)</span>
          <span style="font-family: monospace; display: block; margin-bottom: 0.25rem; color: #555;">#FCBF60</span>
          <span style="font-size: 0.875rem; color: #666;">CTAs, key highlights</span>
        </div>
      </div>

      <div style="width: 150px; border-radius: 4px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.2);">
        <div style="height: 100px; background: rgba(254, 201, 118, 0.9);" />
        <div style="padding: 0.5rem; background: #fff;">
          <span style="font-weight: bold; display: block; margin-bottom: 0.25rem;">Rajah Light</span>
          <span style="font-family: monospace; display: block; margin-bottom: 0.25rem; color: #555;">rgba(254,201,118,0.9)</span>
          <span style="font-size: 0.875rem; color: #666;">Accent hover states</span>
        </div>
      </div>

      <div style="width: 150px; border-radius: 4px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.2);">
        <div style="height: 100px; background: rgba(254, 201, 118, 0.2);" />
        <div style="padding: 0.5rem; background: #fff;">
          <span style="font-weight: bold; display: block; margin-bottom: 0.25rem;">Rajah Extra Light</span>
          <span style="font-family: monospace; display: block; margin-bottom: 0.25rem; color: #555;">rgba(254,201,118,0.2)</span>
          <span style="font-size: 0.875rem; color: #666;">Subtle yellow backgrounds</span>
        </div>
      </div>

      <!-- Text & Neutrals -->
      <div style="width: 150px; border-radius: 4px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.2);">
        <div style="height: 100px; background: #3D3A44;" />
        <div style="padding: 0.5rem; background: #fff;">
          <span style="font-weight: bold; display: block; margin-bottom: 0.25rem;">Text on Rajah</span>
          <span style="font-family: monospace; display: block; margin-bottom: 0.25rem; color: #555;">#3D3A44</span>
          <span style="font-size: 0.875rem; color: #666;">Text over yellow backgrounds</span>
        </div>
      </div>

      <div style="width: 150px; border-radius: 4px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.2);">
        <div style="height: 100px; background: #D9DAD9;" />
        <div style="padding: 0.5rem; background: #fff;">
          <span style="font-weight: bold; display: block; margin-bottom: 0.25rem;">Ivory Grey (Neutral Light)</span>
          <span style="font-family: monospace; display: block; margin-bottom: 0.25rem; color: #555;">#D9DAD9</span>
          <span style="font-size: 0.875rem; color: #666;">Backgrounds, dividers, cards</span>
        </div>
      </div>

      <div style="width: 150px; border-radius: 4px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.2);">
        <div style="height: 100px; background: #777777;" />
        <div style="padding: 0.5rem; background: #fff;">
          <span style="font-weight: bold; display: block; margin-bottom: 0.25rem;">Dark Grey (Text Secondary)</span>
          <span style="font-family: monospace; display: block; margin-bottom: 0.25rem; color: #555;">#777777</span>
          <span style="font-size: 0.875rem; color: #666;">Secondary text, captions</span>
        </div>
      </div>

      <div style="width: 150px; border-radius: 4px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.2);">
        <div style="height: 100px; background: #00709D;" />
        <div style="padding: 0.5rem; background: #fff;">
          <span style="font-weight: bold; display: block; margin-bottom: 0.25rem;">Link Blue</span>
          <span style="font-family: monospace; display: block; margin-bottom: 0.25rem; color: #555;">#00709D</span>
          <span style="font-size: 0.875rem; color: #666;">Hyperlinks, underlines</span>
        </div>
      </div>

      <div style="width: 150px; border-radius: 4px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.2);">
        <div style="height: 100px; background: #C90304;" />
        <div style="padding: 0.5rem; background: #fff;">
          <span style="font-weight: bold; display: block; margin-bottom: 0.25rem;">PDF Red (Error)</span>
          <span style="font-family: monospace; display: block; margin-bottom: 0.25rem; color: #555;">#C90304</span>
          <span style="font-size: 0.875rem; color: #666;">Error messages, destructive actions</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'ExampleComponent',
}
</script>

<style scoped lang="scss">
// use SCSS and CSS variables within your styles:
.example {
  color: $skyBlue;
  background: var(--indigoExtraLight);
}
/* use vuetify color */
.viaVuetify {
  color: rgb(var(--v-theme-primary));
}
</style>
