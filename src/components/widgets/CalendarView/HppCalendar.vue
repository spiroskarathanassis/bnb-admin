<script setup lang="ts">
import 'vue-cal/dist/vuecal.css';

import moment from 'moment';
import { useQuasar } from 'quasar';
import { computed, ref } from 'vue';
import VueCal from 'vue-cal';

import { SpecialPrice } from '@/types';

import CalendarCell from './CalendarCell.vue';
import CalendarCellSelected from './CalendarCellSelected.vue';
import { CalendarEvent, CalendarEventType, Cell } from './calendarTypes';
import PropertySettings from './PropertySettings.vue';
import { PropertySettingsTranslationsTypes } from './propertySettingsTranslationsTypes';

const props = withDefaults(
  defineProps<{
    events: CalendarEvent[];
    lastDate: Date;
    locale: string;
    specialPrices: SpecialPrice[];
    defaultPrice: number;
    hasEditAccess?: boolean;
    translations: {
      propertySettings: Partial<PropertySettingsTranslationsTypes>;
    };
  }>(),
  {
    hasEditAccess: false,
    translations: undefined,
  }
);

interface SelectedCells {
  firstCell: Cell['formattedDate'];
  lastCell: Cell['formattedDate'];
}

const $q = useQuasar();

const isDrawerExpanded = ref(false);
const selectedCells = ref<SelectedCells>({
  firstCell: '',
  lastCell: '',
});

const isDrawer = computed(() => {
  return $q.screen.lt.lg;
});

const assignLogic = (cellDate: Cell['formattedDate']) => {
  let tempSelectedCells: SelectedCells = {
    firstCell: '',
    lastCell: '',
  };

  // 1. If selected are empty, add into the first & last cell
  if (!selectedCells.value.firstCell && !selectedCells.value.lastCell) {
    tempSelectedCells = {
      firstCell: cellDate,
      lastCell: cellDate,
    };

    return tempSelectedCells;
  }

  // 2.1 If selected have first and last element the same
  //     = toggle and reset
  if (
    selectedCells.value.firstCell === cellDate &&
    selectedCells.value.lastCell === cellDate
  ) {
    tempSelectedCells = {
      firstCell: '',
      lastCell: '',
    };

    return tempSelectedCells;
  }
  // 2.2 If the cell is already selected or in between,
  //     + and If selected have 2 different elements and
  //     = reset and select only the current cell
  if (
    moment(cellDate, 'YYYY-MM-DD').isBetween(
      moment(selectedCells.value.firstCell, 'YYYY-MM-DD'),
      moment(selectedCells.value.lastCell, 'YYYY-MM-DD'),
      'days',
      '[]'
    )
  ) {
    tempSelectedCells = {
      firstCell: cellDate,
      lastCell: cellDate,
    };

    return tempSelectedCells;
  }

  // 3.1 If the cell is not selected
  //     + but the selected have the same first and last element
  //     = extend the selection and place first and last in order them by date
  if (selectedCells.value.firstCell === selectedCells.value.lastCell) {
    const isNewCellBeforeExisting = moment(cellDate, 'YYYY-MM-DD').isBefore(
      moment(selectedCells.value.firstCell, 'YYYY-MM-DD')
    );

    tempSelectedCells = {
      firstCell: isNewCellBeforeExisting
        ? cellDate
        : selectedCells.value.firstCell,
      lastCell: isNewCellBeforeExisting
        ? selectedCells.value.firstCell
        : cellDate,
    };

    return tempSelectedCells;
  }

  // 3.2 If the cell is not selected
  //     + but the selected have 2 different elements
  //     = extend the selection and by replacing the nearest cell and order them by date
  const firstCellDiffDates = Math.abs(
    moment(cellDate, 'YYYY-MM-DD').diff(
      moment(selectedCells.value.firstCell, 'YYYY-MM-DD'),
      'days',
      true
    )
  );
  const lastCellDiffDates = Math.abs(
    moment(cellDate, 'YYYY-MM-DD').diff(
      moment(selectedCells.value.lastCell, 'YYYY-MM-DD'),
      'days',
      true
    )
  );

  const isFirstCellCloser = firstCellDiffDates < lastCellDiffDates;
  tempSelectedCells = {
    firstCell: isFirstCellCloser ? cellDate : selectedCells.value.firstCell,
    lastCell: isFirstCellCloser ? selectedCells.value.lastCell : cellDate,
  };

  return tempSelectedCells;
};

const addSelectedCell = (cellDate: Cell['formattedDate']) => {
  const tempSelectedCells = assignLogic(cellDate);

  // check validity - if there is an event between the selected cells not update
  const isEventBetween = props.events
    .filter((e) => e.eventType !== CalendarEventType.UNAVAILABLE)
    .some((event) =>
      moment(event.start).isBetween(
        moment(tempSelectedCells.firstCell, 'YYYY-MM-DD'),
        moment(tempSelectedCells.lastCell, 'YYYY-MM-DD'),
        'days',
        '[)'
      )
    );

  if (isEventBetween) {
    selectedCells.value = {
      firstCell: cellDate,
      lastCell: cellDate,
    };
    return;
  }

  selectedCells.value = tempSelectedCells;
};

const datePrice = (cellDate: Cell['formattedDate']) => {
  const specialPrice = props.specialPrices.find((sp) =>
    moment(cellDate, 'YYYY-MM-DD').isBetween(sp.from, sp.to, 'days', '[]')
  )?.price;

  return specialPrice ?? props.defaultPrice;
};

const formatDate = (date: Date) => {
  return moment(date).format('YYYY-MM-DD');
};

const resetSettings = () => {
  selectedCells.value = {
    firstCell: '',
    lastCell: '',
  };
  isDrawerExpanded.value = false;
};
</script>

<template>
  <vue-cal
    class="tw-bg-white"
    activeView="month"
    :time="false"
    :maxDate="lastDate"
    :minDate="new Date()"
    :disable-views="['years', 'year', 'week', 'day']"
    events-on-month-view
    :events="events"
    :cell-click-hold="true"
    :locale="locale"
  >
    <template #cell-content="{ cell, events }">
      <CalendarCellSelected
        v-if="
          !cell.outOfScope &&
          hasEditAccess &&
          (!events.length ||
            events[0].eventType === CalendarEventType.UNAVAILABLE ||
            formatDate(events[0].end) === cell.formattedDate)
        "
        :cellDate="cell.formattedDate"
        :selectedCells="selectedCells"
        @select="addSelectedCell"
      />

      <CalendarCell
        :events="events"
        :cell="cell"
        :defaultPrice="datePrice(cell.formattedDate)"
      />
    </template>
  </vue-cal>

  <Teleport
    v-if="selectedCells.firstCell"
    :to="!isDrawer ? '#calendarSettings' : '#bnb'"
  >
    <div
      :class="[
        !isDrawer
          ? 'tw-w-[360px]'
          : 'tw-w-full tw-fixed tw-z-50 tw-bottom-0 tw-max-h-[80dvh] tw-left-0 tw-flex tw-flex-col tw-justify-end',
      ]"
    >
      <div
        class="tw-relative tw-w-full"
        :class="{ 'tw-shadow-md tw-shadow-black': isDrawer }"
      >
        <PropertySettings
          :fromDate="selectedCells.firstCell"
          :toDate="selectedCells.lastCell"
          :translations="translations?.propertySettings"
          :class="[
            {
              'tw-rounded-b-none tw-max-h-[80dvh]': isDrawer,
              'tw-h-16': isDrawer && !isDrawerExpanded,
            },
            isDrawer && !isDrawerExpanded
              ? 'tw-overflow-hidden'
              : 'tw-overflow-y-auto',
          ]"
          @close="resetSettings"
        />
        <div
          v-show="isDrawer"
          class="tw-absolute tw-top-0 tw-w-full tw-flex tw-justify-center -tw-translate-y-1/2"
        >
          <q-btn
            :icon="
              isDrawerExpanded ? 'keyboard_arrow_down' : 'keyboard_arrow_up'
            "
            fill
            unelevated
            dense
            color="white"
            text-color="black"
            class="tw-w-16 tw-self-center tw-rounded-full tw-border tw-border-gray-100 tw-border-solid"
            @click="isDrawerExpanded = !isDrawerExpanded"
          />
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style lang="scss">
$themeCalendarColor: var(--bnb-primary);

.vuecal {
  box-shadow: none;

  &__header {
    border: 1px inset #00000014;
    border-radius: 12px 12px 0 0;
    overflow: hidden;
  }
  &__bg,
  &__body {
    overflow: unset !important;
  }
}
.vuecal__menu {
  display: none !important;
}
.vuecal__event-title {
  display: none;
}
.vuecal__title-bar {
  background: $themeCalendarColor;
  color: white;
  font-weight: bold;

  button {
    color: white;
    padding: 1rem;
  }
}
.month-view {
  position: relative;
  // overflow: hidden;
}
.vuecal--month-view .vuecal__cell {
  height: 100px;

  @media screen and (max-width: 500px) {
    height: 60px;
  }
}
.vuecal--no-time .vuecal__event {
  min-height: unset;
}

.vuecal--month-view .vuecal__cell-content {
  justify-content: flex-start;
  height: 100%;
  align-items: flex-end;
}

.vuecal--month-view .vuecal__cell-date {
  padding: 4px;
}
</style>
