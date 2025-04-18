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
                id: z.string(),

                country: z.string().nullable(),

                friend_count: z.number().nullable(),
                supporter_tier: z.number(),
            }),
        })
        .readonly(),
);

const { define: UserDefine, reuse: User } = createReusableTemplate();
const { define: LogoDefine, reuse: Logo } = createReusableTemplate();
</script>

<template>
    <div class="relative">
        <UserDefine>
            <div>
                <n-flex size="small" vertical>
                    <n-flex align="center" size="small">
                        <n-image :img-props="{ class: 'size-12' }" :src="getAvatar(data.user.avatar)" />

                        <n-flex :size="0" vertical>
                            <n-text class="text-(6 current) fw-bold leading-none">
                                {{ data.user.name.toUpperCase() }}
                            </n-text>

                            <n-text :depth="3" class="text-xs">{{ data.user.id }}</n-text>
                        </n-flex>

                        <n-flex align="center" size="small" vertical>
                            <template v-if="isNonNullish(data.user.country)">
                                <v2-country :code="data.user.country" class="[&>img]:(h-4) rounded-sm" />
                            </template>
                        </n-flex>
                    </n-flex>

                    <n-divider class="!my-0" />

                    <template v-if="isNonNullish(data.user.friend_count) || data.user.supporter_tier > 0">
                        <n-flex :size="0" align="center" justify="space-between">
                            <template v-if="isNonNullish(data.user.friend_count)">
                                <n-flex align="center" class="!gap-0.5">
                                    <n-icon :component="HeartFilled" class="text-5" />
                                    <n-text class="text-current">{{ data.user.friend_count }}</n-text>
                                </n-flex>
                            </template>

                            <template v-if="data.user.supporter_tier > 0">
                                <n-flex :size="0" align="center" class="ml-5">
                                    <template v-for="_ in data.user.supporter_tier">
                                        <n-icon
                                            :component="StarFilled"
                                            class="text-5 drop-shadow-[0_0_0.5rem_#FF4A19]"
                                        />
                                    </template>
                                </n-flex>
                            </template>
                        </n-flex>
                    </template>
                </n-flex>
            </div>
        </UserDefine>

        <LogoDefine>
            <div>
                <n-flex :size="0" align="center" class="!gap-1">
                    <n-image :src="logo" class="[&>img]:size-4" />
                    <n-text class="text-white fw-bold">TETR.IO</n-text>
                </n-flex>
            </div>
        </LogoDefine>

        <template v-if="isNonNullish(data.user.banner)">
            <n-image :src="data.user.banner" class="[&>img]:(w-full)" />

            <div class="absolute top-1/2 left-1/2 -translate-1/2 w-full">
                <div class="px-2.5">
                    <n-flex align="center" justify="space-between">
                        <div class="bg-(black opacity-75) rounded backdrop-(blur-sm brightness-50) p-2.5">
                            <User />
                        </div>

                        <div class="bg-(black opacity-75) rounded backdrop-(blur-sm brightness-50) p-2">
                            <Logo />
                        </div>
                    </n-flex>
                </div>
            </div>
        </template>

        <template v-else>
            <n-flex align="center" justify="space-between">
                <User />
                <Logo />
            </n-flex>
        </template>
    </div>
</template>
