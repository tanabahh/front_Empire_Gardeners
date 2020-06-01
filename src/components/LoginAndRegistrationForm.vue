<template>
    <div class="formma" >
        <div id="wrapper">
            <table>
                <tr>
                    <td>Имя: </td>
                    <td><input class="textarea" id="username" name="username" placeholder=" username" type="text" v-model="username" @click="clearMessage"></td>
                </tr>
                <tr>
                    <td>Пароль: </td>
                    <td><input class="textarea" id="password" name="password" placeholder=" password" type="password"  v-model="password" @click="clearMessage"></td>
                </tr>
                <tr v-if="formName === 'registration'">
                    <td>Повторите пароль: </td>
                    <td><input class="textarea" id="password2" name="password2" placeholder=" password" type="password" v-model="confirmPassword" @click="clearMessage"></td>
                </tr>
            </table>
            <div id="arrow"></div>
        </div>
        <div v-if="formName === 'login'">
            <button id="LogButton" type="submit" v-on:click="validateForm('login')">Вход</button>
            <p style="color: #000080" v-if="isL" id="l">{{lError}}</p>
        </div>
        <div v-else>
            <button id="RegButton" type="submit" v-on:click="validateForm('reg')">Зарегистрироваться</button>
            <p style="color: #000080" v-if="isR" id="r" >{{this.rError}}</p>
        </div>
        <img width="500" height="300" float="right" src="./login.png">
        <p :hidden="isErrorMessageHidden" style="color: red" id="erMes" >{{this.errorMessage}}</p>

    </div>
</template>

<script>
    import Table from "@/components/Table";
    export default {
        name: "loginAndRegistrationForm",
        // eslint-disable-next-line vue/no-unused-components
        components: {Table},
        props: {
            formName: String
        },
        data: function () {
            return {
                password: "",
                username: "",
                confirmPassword: "",
                isErrorMessageHidden: true,
                lError: "доступ запрещен",
                rError: "имя занято",
                isR: false,
                isL: false,
                statusss: "",
                errorMessage: "",
            }
        },
        watch: {
            formName: function () {
                this.password = "";
                this.username = "";
                this.confirmPassword = "";
            }
        },
        methods: {
            packParams: function(params) {
                const p= [];

                for (const [key, value] of Object.entries(params)) {
                    p.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
                }

                return p.join('&');
            },
            clearMessage: function(){
                this.isErrorMessageHidden = true;
            },
            registF: function(){
                const username = this.username;
                const password = this.password;
                this.$axios.post("/api/v1/user/register", this.packParams({username, password}),
                    {
                        headers:{'Content-Type': 'application/x-www-form-urlencoded'}
                    }
                ).then(response => {
                    console.log(response.status);
                    if(200 <= response.status < 300) {
                        console.log("register, now do login");
                        this.loginF();
                    }
                }).catch( () => {
                    this.isL = false;
                    this.isR = true;
                });
            },
            loginF: function(){
                const username = this.username;
                const password = this.password;
                let base64Credential = btoa(username+':'+password);
                this.$axios.get("/api/v1/user/login", {
                    headers:  {'Authorization': 'Basic ' + base64Credential}
                }).then(response => {
                    console.log('in response of login');
                    console.log(response.status);
                    this.status = response.status;
                    if (response.status === 200) {
                        console.log("response data");
                        console.log(response.data);
                        sessionStorage.setItem("jwt", base64Credential);
                        this.$router.push({path: "/home"});
                    }
                }).catch( () => {
                    if (this.status === 403){
                        this.lError = "hellllllooo";
                    }
                    this.isR = false;
                    this.isL = true;
                    // message="доступ запрещен";
                    // this.setError("l", message)
                });

            },
            validateForm: function (type) {
                if (!/^[a-z][a-z\d]*$/i.test(this.username)) {
                    this.isErrorMessageHidden = false;
                    this.errorMessage = "Логин может состоять из латинских букв и цифр, но не может начинаться с цифры";

                }
                else if (!/^[a-z\d]*$/i.test(this.password)) {
                    this.isErrorMessageHidden = false;
                    this.errorMessage = "Пароль может состоять из латинских букв и цифр";
                    // setTimeout(this.errorMessage="",3000);
                }
                else if (this.formName === "registration" && this.password !== this.confirmPassword) {
                    this.isErrorMessageHidden = false;
                    this.errorMessage = "Пароли не совпадают";
                    // setTimeout(this.errorMessage="",3000);
                }
                else {
                    this.isErrorMessageHidden = true;
                    if (type === "login") this.loginF();
                    else this.registF();
                }
            }
        }
    }
</script>

<style  scoped>
    @media (min-width: 1133px) {
        .formma {
           display: flex;
            justify-content: center;
    }
    }
    @media (max-width: 784px) {
        .formma {
            margin-right: auto;
            margin-left: auto;
            display: grid;
        }
    }
    @media (max-width: 784px) {
        .formma {
            margin-right: auto;
            margin-left: auto;
            display: grid;
        }
    }
table{
    margin: auto;
}
body {
    margin:0px;
    line-height: 1.42;
    -webkit-font-smoothing: antialiased;
    background: #87CEEB;
    background-clip: padding-box;
}

form {
    width: 450px;
    height: 370px;
    margin: -165px -225px;
    position: absolute;
    left: 50%;
    top: 50%;
}

button {
    background: #2e82c3;
    margin: 30px ;
    border-radius: 7px;
    color: #fff;
    text-align: center;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 18px;
    height: 50px;
    text-decoration: none;
    padding: 0.7em 1.5em;
}

button:hover {
    background: #000080;
}

.textarea {
    resize: both;
    max-width: 16em;
    max-height: 6em;
    min-width: 8em;
    min-height: 2em;
    width: 16em;
    height: 2em;
    border: 1px solid #000080;
}
</style>
