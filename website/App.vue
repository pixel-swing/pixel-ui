<template>
  <px-layout>
    <px-header class="demo-header" height="64">
      <router-link to="/home">{{ state.name }}</router-link>
    </px-header>
    <px-layout>
      <px-sider class="demo-sider" width="300">
        <px-menu @open="handleOpen">
          <px-sub-menu title="选秀" icon-name="write">
            <px-menu-item>菜单 </px-menu-item>
          </px-sub-menu>
          <px-menu-item>菜单</px-menu-item>
          <px-menu-item>菜单</px-menu-item>
          <px-menu-item>菜单</px-menu-item>
          <px-menu-item>菜单</px-menu-item>
        </px-menu>
      </px-sider>
      <px-content class="demo-content">
        <div>
          <px-icon iconName="AccessibleIcon" width="32" height="32"></px-icon>
          <p-button size="large">超大按钮</p-button>
          <p-button>基本按钮</p-button>
          <p-button size="medium">中等按钮</p-button>
          <p-button size="small">小的按钮</p-button>
          <p-button size="mini">较小按钮</p-button>
        </div>
        <div>
          <p-button>基本按钮</p-button>
          <p-button type="primary">主要按钮</p-button>
          <p-button type="success">成功按钮</p-button>
          <p-button type="info">信息按钮</p-button>
          <p-button type="warning">警告按钮</p-button>
          <p-button type="danger">危险按钮</p-button>
        </div>
        <div>
          <p-button size="medium" hover-type="jelly">主要按钮</p-button>
          <p-button size="medium" hover-type="shake">主要按钮</p-button>
        </div>
      </px-content>
    </px-layout>
    <px-footer>Footer</px-footer>
  </px-layout>
  <keep-alive>
    <router-view></router-view>
  </keep-alive>
</template>

<script setup lang="ts">
import { computed, reactive } from '@vue/reactivity'
import { RouterLink, RouterView, useRoute } from 'vue-router'
import PButton from '../packages/button'
import PxLayout from '../packages/layout'
// import PxMenu from '../packages/menu/Menu.vue'
import PxMenu from '../packages/menu'
import PxMenuItem from '../packages/menu/MenuItem'

import PxSubMenu from '../packages/menu/SubMenu'

const { PxHeader, PxContent, PxFooter, PxSider } = PxLayout
const state = reactive({ name: 'pixel-ui' })
const handleOpen = (res) => {
  console.log(res)
}
</script>

<style>
body,
html {
  color: #182026;
  font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, SimSun, sans-serif;
  margin: 0;
}
.demo-header {
  display: flex;
  align-items: center;
  height: 48px;
  background: rgb(103, 151, 238);
}
.demo-sider {
  display: flex;
  /* align-items: center; */
  background: rgb(144, 170, 218);
}
.demo-content {
  display: flex;
  flex-direction: column;
  padding: 24px;
  height: 520px;
}
</style>
