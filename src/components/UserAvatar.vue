
<template>
  <div>
    <v-menu open-on-hover offset-y>
      <template v-slot:activator="{ on, attrs }">
        <v-avatar v-bind="attrs" v-on="on" rounded="false">
          <img :src="$store.getters.avatarHash" :alt="$store.getters.username" />
        </v-avatar>
      </template>

      <!-- 设置用户Profile -->
      <v-list dense>
        <v-list-item-group>
          <v-list-item v-for="(item, index) in items" :key="index" :to="{name: item.name, params: {id: $store.getters.userId}}">
            <v-list-item-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title v-text="item.title"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-menu>
  </div>
</template>

<script>
export default {
  data: () => ({
    items: [
      { title: '我的主页', icon: 'account_circle', name: 'user_information' },
      { title: '创作中心', icon: 'edit', name: 'block' },
      { title: '设置', icon: 'settings', name: 'settings' },
      { title: '退出', icon: 'power_settings_new', name: 'logout' }
    ]
  })
}
</script>
