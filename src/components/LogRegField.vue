<template>
<div id = "logRegField">
    <input checked="" id="signin" v-on:click="makeActive('login')" name="action" type="radio" value="signin">
    <label for="signin">Вход в сад</label>
    <input id="signup" v-on:click="makeActive('registration')" name="action" type="radio" value="signup">
    <label for="signup">Вы новый садовод?</label>

    <login-and-registration-form v-bind:form-name="active"/>


<!--    <a href="#" class="login" v-on:click="makeActive('login')">Вход</a>&ndash;&gt;-->
<!--    <a href="#" class="registration" v-on:click="makeActive('registration')">Регистрация</a>-->



</div>
</template>

<script>
import LoginAndRegistrationForm from "./LoginAndRegistrationForm";

    export default {
        name: "LogRegField",
        components: {
            LoginAndRegistrationForm
        },
        data() {
            return {
                active: "login",
                color: "#5e5b64"
            }
        },
        methods: {
            makeActive: function (item) {
                this.active = item;
                // eslint-disable-next-line no-console
                console.log(this.active);
            }
        },
    }
</script>

<style scoped>
    #logRegField {
        background:oldlace;
        width: 100%;
        max-width: 1200px;
        min-height: 100%;
        padding: 10px;
        margin: 0 auto;
        color: #000080;
        font: italic  12pt monospace;
    }

    input[type=radio] { display: none; }

    label {
        cursor: pointer;
        display: inline-block;
        font: italic  16px monospace;
        font-weight: 800;
        opacity: .5;
        margin-bottom: 30px;
    }
    label:hover {
        transition: all .3s cubic-bezier(.6,0,.4,1);
        opacity: 1;
    }
    label[for="signin"] { margin-right: 20px; }
    label[for="reset"] { float: right; }
    input[type=radio]:checked + label { opacity: 1; }


</style>