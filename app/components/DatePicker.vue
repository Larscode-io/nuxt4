<template>
  <v-locale-provider :locale="locale">
    <v-date-picker
      v-model="picker"
      class="datePicker"
      :locale="locale"
      readonly
      :aria-label="ariaLabel"
      @update:model-value="handleChange"
      :title="'none'"
    />
  </v-locale-provider>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from "vue";

const { t, locale } = useLanguage();

const picker = ref(new Date());

const ariaLabel = computed(() => {
  const selectedDate = new Date(picker.value);
  return (
    t('aria.label.landing.agenda.date') +
    " " +
    selectedDate.toLocaleDateString(locale.value, {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  );
});

const handleChange = (value) => {
  if (!value) return;
  const dateObj = new Date(value);
  emit("change", dateObj);
};

onMounted(() => {
  nextTick(() => {
    document.querySelectorAll(".v-date-picker-header button").forEach((el) => {
      el.setAttribute("tabindex", "-1");
    });
    document.querySelectorAll(".v-btn").forEach((el) => {
      el.setAttribute("tabindex", "-1");
    });
  });
});
</script>

<style lang="scss">
.datePicker > *:focus {
  outline: 2px solid black;
}

.v-picker {
  margin-bottom: 40px;
  height: fit-content;

  box-shadow: 0 0 4px 2px rgba(0, 0, 0, 0.08) !important;

  &:focus {
    outline: 2px solid black;
  }

  @media (max-width: 600px) {
    width: calc(100% - 32px);
    margin: auto;
    margin-bottom: 20px;
  }

  .v-date-picker__title,
  .v-picker-title,
  .v-date-picker-header {
    display: none;
    max-height: 0px !important;
    max-width: 0px !important;
  }

  .v-date-picker-month__day {
    pointer-events: none;
  }

  .v-date-picker-month__day--selected {
    .v-btn {
      background-color: #82b1ff;
    }
  }

  .v-date-picker-controls {
    margin: 0;
    border-radius: 0;
  }

  .v-date-picker-table {
    padding: 12px;
    height: auto;
  }
}

.v-picker__body .v-btn::before {
  background-color: transparent;
}

.theme--light.v-date-picker-table th {
  color: #666;
}
</style>
