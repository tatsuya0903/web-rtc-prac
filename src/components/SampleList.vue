<template>
  <v-card>
    <v-list two-line>
      <template v-for="(item, index) in items">
        <v-divider v-if="index > 0" :key="`${item.title}-divider`" />
        <v-list-item :key="item.title" :to="item.to">
          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
            <v-list-item-subtitle>{{ item.subtitle }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </template>
    </v-list>
  </v-card>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import { Location } from 'vue-router'
import { RouteLocations } from '@/router/models'

type Item = {
  title: string
  subtitle: string
  to: Location
}
type State = {}
type Props = {
  apiKey: string
}
export default defineComponent({
  components: {},
  props: {
    apiKey: { type: String, required: true },
  },
  setup(props: Props) {
    const items = computed<Item[]>(() => {
      return [
        {
          title: 'サンプル1',
          subtitle: 'Peer接続＆切断',
          to: RouteLocations.toSample1(props.apiKey),
        },
        {
          title: 'サンプル2',
          subtitle: 'P2Pでテキスト送受信',
          to: RouteLocations.toSample2(props.apiKey),
        },
        {
          title: 'サンプル3',
          subtitle: 'ルーム機能でテキスト送受信',
          to: RouteLocations.toSample3(props.apiKey),
        },
        {
          title: 'サンプル4',
          subtitle: 'P2Pで画像ファイルをダウンロード',
          to: RouteLocations.toSample4(props.apiKey),
        },
        {
          title: 'サンプル5',
          subtitle: 'ルーム機能で動画配信(一方向のみ)',
          to: RouteLocations.toSample5(props.apiKey),
        },
      ]
    })
    return {
      items,
    }
  },
})
</script>

<style lang="scss" scoped></style>
