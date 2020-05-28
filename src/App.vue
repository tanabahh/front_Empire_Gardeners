<template>
  <div id="app">
    <Header v-bind="headerParams"/>
    <div id = "logregApp">
      <router-view/>
    </div>
    <!--    <Footer v-bind="footerParams"/>-->
  </div>
</template>

<script>

  import Header from "./components/Header.vue";

  export default {
    name: 'app',
    components: {
      Header//, Footer
    },
    data: function () {
      return {
        headerParams: {
          title: "Лабораторная работа №4, Вариант 131611",
          authorName: "Можанова Таисия Евгеньевна P3212",
        },
        footerParams: {
          devYear: new Date()
        }
      }
    },
  }
</script>

<style>
  #app {
    top: 0;
    left: 0;
    width: 100%;
    position: fixed;
    text-align: center;
    background: #87CEEB;
    margin-top: 100px;
  }

</style>
