<script lang="ts" setup>
import { HeartFilled, StarFilled } from '@vicons/antd';
import { createReusableTemplate } from '@vueuse/core';
import { isNonNullish } from 'remeda';
import { z } from 'zod';
import logo from '~/assets/images/logo/tetrio.svg';
import { getAvatar } from '~/components/shared/avatar.vue';
import Avatar from '~/types/avatar';

const data = useData(
    z
        .object({
            user: z.object({
                banner: z.string().nullable(),
                avatar: Avatar,

                name: z.string(),
                old_names: z.array(z.string()).default([]),
                role: z.string(),
                bio: z.string().nullable(),
                id: z.string(),

                country: z.string().nullable(),

                friend_count: z.number().nullable(),
                supporter_tier: z.number(),
            }),
        })
        .readonly(),
);

const { define: LogoDefine, reuse: Logo } = createReusableTemplate();

const visibleOldNames = computed(() =>
    data.user.role === 'hidden' ? [] : data.user.old_names.map((name) => name.toUpperCase()),
);

const bioText = computed(() => {
    if (data.user.bio === null) return null;

    const text = new DOMParser().parseFromString(data.user.bio, 'text/html').body.textContent;
    return text?.trim() ? text : null;
});
</script>

<template>
    <div class="rounded-md overflow-hidden bg-[#18181c] border border-solid border-white/10">
        <LogoDefine>
            <div class="flex shrink-0 items-center gap-1">
                <n-image :src="logo" class="[&>img]:size-4" />
                <n-text class="text-white fw-bold">TETR.IO</n-text>
            </div>
        </LogoDefine>

        <div v-if="isNonNullish(data.user.banner)" class="relative h-[116px] overflow-hidden">
            <img :src="data.user.banner" alt="" class="w-full h-full object-cover block" />
            <div
                class="absolute inset-0 bg-gradient-to-t from-[#18181c]/70 via-transparent to-black/25 pointer-events-none"
            />
            <div
                class="absolute top-2.5 right-3 bg-black/55 backdrop-blur-sm rounded px-2 py-1 border border-solid border-white/10"
            >
                <Logo />
            </div>
        </div>

        <div class="px-4 pb-3.5" :class="isNonNullish(data.user.banner) ? 'pt-0' : 'pt-3.5'">
            <div class="flex items-start gap-3.5">
                <div
                    class="shrink-0 rounded-md overflow-hidden bg-[#18181c]"
                    :class="
                        isNonNullish(data.user.banner)
                            ? '-mt-8 relative z-10 ring-4 ring-[#18181c] shadow-lg'
                            : 'border border-solid border-white/10'
                    "
                >
                    <n-image :img-props="{ class: 'size-16 block' }" :src="getAvatar(data.user.avatar)" class="block" />
                </div>

                <div
                    class="min-w-0 flex-1 flex flex-col gap-1"
                    :class="isNonNullish(data.user.banner) ? 'pt-2' : 'pt-0.5'"
                >
                    <div class="flex flex-wrap items-center justify-between gap-x-4 gap-y-1.5">
                        <div class="flex items-center gap-2 min-w-0">
                            <n-text
                                class="min-w-0 text-[26px] text-white fw-bold leading-none tracking-tight [overflow-wrap:anywhere]"
                            >
                                {{ data.user.name.toUpperCase() }}
                            </n-text>
                            <v2-country
                                v-if="isNonNullish(data.user.country)"
                                :code="data.user.country"
                                class="[&>img]:(h-4.5) rounded-sm shrink-0"
                            />
                        </div>
                        <div class="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                            <n-text :depth="3" class="font-mono text-[11px] [overflow-wrap:anywhere]">{{
                                data.user.id
                            }}</n-text>
                            <span v-if="isNonNullish(data.user.friend_count)" class="flex items-center gap-1">
                                <n-icon :component="HeartFilled" class="text-sm" />
                                <n-text>{{ data.user.friend_count }}</n-text>
                            </span>
                            <span v-if="data.user.supporter_tier > 0" class="flex items-center gap-0.5">
                                <n-icon
                                    v-for="tier in data.user.supporter_tier"
                                    :key="tier"
                                    :component="StarFilled"
                                    class="text-sm drop-shadow-[0_0_0.5rem_#FF4A19]"
                                />
                            </span>
                            <div v-if="!isNonNullish(data.user.banner)" class="flex items-center gap-3">
                                <span aria-hidden="true" class="h-3 w-px bg-white/15" />
                                <Logo />
                            </div>
                        </div>
                    </div>

                    <div
                        v-if="visibleOldNames.length"
                        class="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 pt-0.5 text-xs leading-relaxed"
                    >
                        <span class="text-white/40 shrink-0 font-medium">{{
                            $t('v2.tetrio.user.info.old_names')
                        }}</span>
                        <div class="min-w-0 flex-1 flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5">
                            <template v-for="(name, index) in visibleOldNames" :key="index">
                                <span v-if="index > 0" class="text-white/25 select-none">·</span>
                                <span class="max-w-full text-white/75 tracking-wide [overflow-wrap:anywhere]">{{
                                    name
                                }}</span>
                            </template>
                        </div>
                    </div>
                </div>
            </div>

            <div
                v-if="isNonNullish(bioText)"
                class="mt-3 pt-2.5 border-t border-t-solid border-white/8 text-[13px] text-white/80 leading-relaxed [overflow-wrap:anywhere]"
            >
                {{ bioText }}
            </div>
        </div>
    </div>
</template>
