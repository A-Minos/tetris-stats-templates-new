<script lang="ts" setup>
import { Status } from '~/components/v1/binding/status/index.vue';

const { t } = useI18n();

const data = useData<
    | {
          readonly type: Status.SUCCESS | Status.UNVERIFIED | Status.UNKNOWN;

          readonly command: string;
      }
    | {
          readonly type: Status.UNBIND;

          readonly command: string;

          readonly bot: {
              readonly name: string;
          };
      }
    | {
          readonly type: Status.ERROR;

          readonly error: string;
      }
>();
</script>

<template>
    <i18n-t
        :keypath="`v1.binding.footer.${data.type}.text`"
        :style="{ 'font-weight': t(`v1.binding.footer.${data.type}.styles.fw`) }"
        tag="span"
        class="w-81 mx-auto font-template text-4 text-center text-[#52525C]"
    >
        <template
            v-if="
                data.type === Status.SUCCESS ||
                data.type === Status.UNVERIFIED ||
                data.type === Status.UNKNOWN ||
                data.type === Status.UNBIND
            "
            v-slot:command
        >
            <span class="fw-500">“{{ data.command }}”</span>
        </template>
        <template v-if="data.type === Status.UNBIND" v-slot:botName>
            <span class="fw-500">{{ data.bot.name }}</span>
        </template>
        <template v-if="data.type === Status.ERROR" v-slot:error>
            <span>{{ data.error }}</span>
        </template>
    </i18n-t>
</template>
