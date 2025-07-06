<template>
  <div>
    <!-- kleur komende van css variabele -->
    <div :style="{ color: 'var(--indigo)' }">
      This text should be a color from a CSS variable.
    </div>
    <div class="example">
      This text uses a scss class with both a SCSS variable and a CSS variable to set its color.
    </div>
    <h1 :style="{ fontFamily: 'Tiempos Headline, serif' }">
      Hello World
    </h1>
    <h2
      class="heading-h2"
      :style="{ fontFamily: 'Tiempos Headline, serif' }"
    >
      This is a paragraph using the global Tiempos Headline font.
    </h2>
    <!-- use vuetify color, short and concise -->
    <!-- coming from a css variable -->
    <v-icon color="pdfRed">
      mdi-file-pdf-box
    </v-icon>
    <!-- coming from a vuetify only theme color -->
    <v-icon color="primary">
      mdi-file-pdf-box
    </v-icon>
    <div color="primary">
      Vuetify color dont work in non vuetify components
    </div>
    <!-- using vuetify color in a div with a css variable -->
    <div :style="{ color: 'var(--pdf-red)' }">
      Content
    </div>
    <!-- using a class with a vuetify theme color  -->
    <!-- theme colors can be used in a class but as we define theme colors with css variables, we better use css variables directly -->
    <v-icon class="viaVuetify">
      mdi-file-pdf-box
    </v-icon>
    <v-btn color="secondary">
      This is a button with a Vuetify color.
    </v-btn>
    <v-btn color="success">
      This is a button with a Vuetify color.
    </v-btn>

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
