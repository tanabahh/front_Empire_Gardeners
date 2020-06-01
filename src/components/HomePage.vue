<template>
    <div class="HomePage">
        <div class="canvas-form">
            <div style="float: left; padding-left: 10%; padding-top: 5%">
                <form name="form"   >
                    <p class="line" span style="font-size:130%;font-style: italic;margin: 40px 0px 40px 120px;">Введите координаты цветочка</p> <img visibility="hidden" width="1" height="1" src="./true.png"><img visibility="hidden" width="1" height="1" src="./false.png">
                    <p class="line"> <label for="valueY">X: </label>
                        <input class="textarea"  id="valueX" name="valueX" type="text" value="" placeholder="-5 ... 5"
                               v-model="point.x" @input="point.x = validate(point.x, -5, 5)" required>
                    </p>

                    <p class="line"> <label for="valueY">Y: </label>
                        <input class="textarea"  id="valueY" name="valueY" type="text" value="" placeholder="-3 ... 3"
                               v-model="point.y" @input="point.y = validate(point.y, -3, 3)" required>
                    </p>

                    <p class="line"> <label for="valueY">R: </label>
                        <input class="textarea"  id="valueR" name="valueR" type="text" value="" placeholder="0 ... 5"
                               v-model="point.r" @input="point.r = validate(point.r, 0, 5)" required @change="redrawGraph">
                    </p>
                </form>
                <p class="line">
                    <button class="send-button"  type="submit" id="submitButton1"  @click="exit" >&nbsp;&nbsp;Выйти&nbsp;&nbsp;</button>
                    <button class="send-button"  type="submit" id="submitButton"  @click="validateData" >Вырастить новый</button>
                </p>
                <p style="color: #000080">{{errorMessage}}</p>
            </div>

                <canvas height="500" width="500" id="zoneCanvas" @click="validateFromGraph"></canvas>
        </div>
        <div id="table">
            <Table v-bind:points="points"/>
        </div>

    </div>

</template>

<script>
    import Table from "./Table";

    export default {
        name: "HomePage",
        components: {Table},
        data() {
            return {
                point: {
                    created: null,
                    hit: null,
                    x: null,
                    y: null,
                    r: null //Изначально задано макс. значение для отрисовки графика в макс. масштабе
                },
                points: [],
                errorMessage:"",
            }
        },
        mounted: function () {
            this.drawZone('zoneCanvas', this.point.r);
            this.loadPoints();
            this.drawPoints();
        },
        methods:{
            packParams: function(params) {
                const p= [];

                for (const [key, value] of Object.entries(params)) {
                    p.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
                }

                return p.join('&');
            },
            deleteAllCookies: function() {
                let cookies = document.cookie.split(";");
                for (let i = 0; i < cookies.length; i++) {
                    let cookie = cookies[i];
                    let eqPos = cookie.indexOf("=");
                    let name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
                    document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
                }
            },
            exit: function(){
                sessionStorage.removeItem("jwt");
                sessionStorage.clear();
                localStorage.clear();
                this.deleteAllCookies();
                //this.$axios.post('/logout', {});
                //this.$axios.post("/logout", {});
                //this.$axios.post("/api/users/logout", {});
                this.$router.push("/logReg");
            },
            validateData: function(){
                if(this.point.x === null || this.point.x === ""){
                    this.errorMessage = "поле x не заполнено"
                }else if(this.point.y === null || this.point.y === ""){
                    this.errorMessage = "поле y не заполнено"
                }else if(this.point.r === null || this.point.r === ""){
                    this.errorMessage = "поле r не заполнено"
                }else if(this.point.x === "-"){
                    this.errorMessage = "не правильно заполнено поле x"
                }else if(this.point.y === "-"){
                    this.errorMessage = "не правильно заполнено поле y"
                }else if(this.point.r === "-"){
                    this.errorMessage = "не правильно заполнено поле r"
                }
                else {
                    console.log('im in validateData');
                    this.updatePoints();
                }
            },
            updatePoints: function(){
                this.$axios.post("/api/v1/points/add",
                    this.packParams({x: parseFloat(this.point.x), y: parseFloat(this.point.y), r: parseFloat(this.point.r)}), {
                    headers:{
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Authorization': 'Basic ' + sessionStorage.getItem('jwt')
                    }
                }).then(response => {
                    console.log("in response of update");
                    this.hit = response.data;
                    this.loadPoints();
                });
            },
            loadPoints: function(){
                this.$axios.get("/api/v1/points/get", {
                    headers:{
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Authorization': 'Basic ' + sessionStorage.getItem("jwt")
                    }
                }).then(response => {
                    this.points = response.data;
                    this.redrawGraph();
                });
            },
            drawPoints: function(r) {
                const correctImage = new Image();
                correctImage.src = '/img/true.d8327e57.png';
                const wrongImage = new Image();
                wrongImage.src = '/img/false.89ccfa1e.png';
                const centerX = 250;
                const centerY = 250;
                const points = this.points;
                if (correctImage.complete && wrongImage.complete) {
                    console.log('im complete');
                    chooseRadius();
                } else {
                    console.log('wait im need some time');
                    correctImage.onload = function () {
                        wrongImage.onload = function(){
                            chooseRadius();
                            console.log('im download img');
                        };
                    };
                }
                function chooseRadius(){
                    if (r != null) {
                        console.log('r!=null');
                        const zoomX = 230 / r;
                        const zoomY = 230 / r;
                        points.forEach((point) => {
                            if (+point.r !== parseFloat(r)) {
                                console.log('выбор точки радиус точки, радиус наш', point.r, parseFloat(r));
                                return;
                            }
                            drawPoint(point, zoomX, zoomY);
                        });
                    } else {
                        console.log('r = null');
                        points.forEach((point) => {
                            const zoomX = 230 / point.r;
                            const zoomY = 230 / point.r;
                            drawPoint(point, zoomX, zoomY);
                        });
                    }
                }
                function drawPoint(point, zoomX, zoomY) {
                    let canvas = document.getElementById("zoneCanvas");
                    let context = canvas.getContext("2d");
                    console.log('draw point with hit ', point.hit);
                    const visualX = centerX + point.x * zoomX;
                    const visualY = centerY - point.y * zoomY;
                    context.drawImage(point.hit ? correctImage : wrongImage, visualX - 15, visualY - 15, 30, 30);
                }
            },
            redrawGraph: function(){
                console.log("redrawGraph. radius is a ", this.point.r);
                this.drawZone('zoneCanvas', this.point.r);
                this.drawPoints(this.point.r);
            },
            drawZone: function(canvasId, r) {
                let canvas = document.getElementById(canvasId);
                let context = canvas.getContext("2d");
                const width = canvas.width;
                const height = canvas.height;

                context.clearRect(0, 0, width, height);

                context.beginPath();
                context.rect(0.5*width, 0.27*height, 0.46*width, 0.23*height);
                context.closePath();
                context.strokeStyle = "dodgerblue";
                context.fillStyle = "dodgerblue";
                context.fill();
                context.stroke();

                context.beginPath();
                context.moveTo(0.5*width, 0.5*height);
                context.arc(0.5*width, 0.5*height, 0.23*height, 5*Math.PI/2 , 3*Math.PI);
                context.closePath();
                context.strokeStyle = "dodgerblue";
                context.fillStyle = "dodgerblue";
                context.fill();
                context.stroke();

                context.beginPath();
                context.moveTo(0.5*width, 0.5*height);
                context.lineTo(0.04*width, 0.5*height);
                context.lineTo(0.5*width, 0.27*height);
                context.lineTo(0.5*width, 0.5*height);
                context.closePath();
                context.strokeStyle = "dodgerblue";
                context.fillStyle = "dodgerblue";
                context.fill();
                context.stroke();

                context.strokeStyle = "black";
                context.fillStyle = "black";
                context.beginPath();
                context.font = "14px Courier New";
                context.moveTo(0.5*width, 0);
                context.lineTo(0.5*width, height);
                context.moveTo(0.5*width, 0);
                context.lineTo(0.49*width, 0.03*height);
                context.moveTo(0.5*width, 0);
                context.lineTo(0.51*width, 0.03*height);
                context.fillText("Y", 0.52*width, 0.02*height);
                context.moveTo(0, 0.5*height);
                context.lineTo(width, 0.5*height);
                context.moveTo(width, 0.5*height);
                context.lineTo(0.97*width, 0.49*height);
                context.moveTo(width, 0.5*height);
                context.lineTo(0.97*width, 0.51*height);
                context.fillText("X", 0.98*width, 0.47*height);

                const R = r == null ? "R" : r;
                const halfR = r == null ? "R/2" : r / 2;

                context.moveTo(0.49*width, 0.04*height);
                context.lineTo(0.51*width, 0.04*height);
                context.fillText(R, 0.51*width, 0.05*height);
                context.moveTo(0.49*width, 0.27*height);
                context.lineTo(0.51*width, 0.27*height);
                context.fillText(halfR, 0.51*width, 0.28*height);
                context.moveTo(0.49*width, 0.73*height);
                context.lineTo(0.51*width, 0.73*height);
                context.fillText(`-${halfR}`, 0.51*width, 0.74*height);
                context.moveTo(0.49*width, 0.96*height);
                context.lineTo(0.51*width, 0.96*height);
                context.fillText(`-${R}`, 0.51*width,0.97*height);
                context.moveTo(0.04*width, 0.49*height);
                context.lineTo(0.04*width, 0.51*height);
                context.fillText(`-${R}`, 0.03*width, 0.48*height);
                context.moveTo(0.27*width, 0.49*height);
                context.lineTo(0.27*width, 0.51*height);
                context.fillText(`-${halfR}`, 0.26*width, 0.48*height);
                context.moveTo(0.73*width, 0.49*height);
                context.lineTo(0.73*width, 0.51*height);
                context.fillText(halfR, 0.72*width, 0.48*height);
                context.moveTo(0.96*width, 0.49*height);
                context.lineTo(0.96*width, 0.51*height);
                context.fillText(R, 0.95*width, 0.48*height);

                context.closePath();
                context.strokeStyle = "black";
                context.fillStyle = "black";
                context.stroke();
                context.closePath();
            },

            validateFromGraph: function () {
                if (this.point.r !== null){
                    let canvas = document.getElementById("zoneCanvas");
                    const rect = canvas.getBoundingClientRect();
                    const width = canvas.width;
                    const height = canvas.height;
                    const visualX = Math.floor(event.clientX - rect.left);
                    const visualY = Math.floor(event.clientY - rect.top);

                    let centerX = width/2;
                    let centerY = height/2;
                    let zoomX = width*0.46 / this.point.r;
                    let zoomY = height*0.46 / this.point.r;
                    this.point.x = (visualX - centerX) / zoomX;
                    this.point.y = (centerY - visualY) / zoomY;
                    this.updatePoints();
                }
            },
            validate : function (input, l, r) {
                this.errorMessage="";
                input = input.replace(/[^0-9,.-]/g, '').replace(/,/, ".");
                if (isNaN(input) && input !== "-")
                    input = "";
                if (input > r)
                    input = r;
                if (input < l) {
                    input = l;
                }
                if (input.length > 10) {
                    input = input.slice(0, -1);
                }
                return input;
            }
        }
    }
</script>

<style scoped>

    .HomePage {
        overflow: visible;
        background:oldlace;
        width: 100%;
        max-width: 1200px;
        min-height: 100%;
        padding: 10px;
        margin: 0 auto;
        color: #000080;
        font: italic  12pt monospace;
    }
    @media (min-width: 1133px) {
        .canvas-form {
            display: flex;
        }
    }
    @media (max-width: 784px) {
        .canvas-form {
            margin-right: auto;
            margin-left: auto;
            display: grid;
        }
    }
    @media (max-width: 784px) {
        .canvas-form {
            margin-right: auto;
            margin-left: auto;
            display: grid;
        }
    }
    .send-button {
        background: #2e82c3;
        margin: 30px ;
    }

    button {
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

    P.line {
        margin: 30px 15px 5px 60px;
        font-weight: bold;
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