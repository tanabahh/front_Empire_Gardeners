<template>
    <div class="HomePage">
        <div>
            <div style="float: left; padding-left: 10%; padding-top: 5%">
                <form name="form"   >
                    <p class="line" span style="font-size:130%;font-style: italic;margin: 40px 0px 40px 120px;">Введите координаты цветочка</p>
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
                <h2 style="color: red">{{errorMessage}}</h2>
            </div>

                <canvas height="500" width="500" id="zoneCanvas" @click="validateFromGraph"></canvas>

        </div>

        <div style="padding-top: 40%; width: 60%; margin: auto">
            <Table v-bind:points="points"/>
        </div>

    </div>

</template>

<script>
    //нужно проверить что с отрисовкой канваса по радиусу
    //и что с табличкой
    import Table from "./Table";

    export default {
        name: "HomePage",
        components: {Table},
        data() {
            return {
                point: {
                    requestDate: null,
                    // isHit: false,
                    result: null,
                    x: "",
                    y: "",
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
            exit: function(){
                sessionStorage.removeItem("jwt");
                this.$router.push("/logReg");
            },
            validateData: function(){
                if(this.point.y===""){
                    this.errorMessage = "поле y не заполнено";
                }
                else if(this.point.y==="-"){
                    this.errorMessage = "не правильное заполнение поля y";
                }
                else {
                    // this.loadPoints();
                    this.updatePoints();
                }
            },
            updatePoints: function(){
                this.$axios.post("/api/v1/points/add", {
                    //login: sessionStorage.getItem("jwt"),
                    x: this.point.x,
                    y: this.point.y,
                    r: this.point.r,
                    //privet: 24312,
                },{
                    headers:{Authorization: "Basic" + localStorage.getItem('jwt')}
                }).then(response => {
                    // alert(response.data);
                    this.points = response.data;
                    this.redrawGraph();
                });
            },
            loadPoints: function(){
                //let login = sessionStorage.getItem("jwt");
                this.$axios.get("/api/v1/points/get", {
                    headers:{Authorization: "Basic" + localStorage.getItem("jwt")}
                }).then(response => {
                    this.points = response.data;
                    this.redrawGraph();
                });
            },
            drawPoints: function(){
                this.points.forEach( element => {
                    this.drawPoint(element);
                });
            },
            redrawGraph: function(){
                // eslint-disable-next-line no-console
                console.log("redrawGraph");
                this.drawZone('zoneCanvas', this.point.r);
                this.drawPoints();
            },
            drawPoint: function (point) {
                const correctImage = new Image();
                correctImage.src = 'assets/true.png';
                const wrongImage = new Image();
                wrongImage.src = 'assets/false.png';
                // eslint-disable-next-line no-console
                console.log("GGGGGFDFDBDBFDBBD");

                let canvas = document.getElementById("zoneCanvas");
                let ctx = canvas.getContext("2d");

                let relX = point.x;
                let relY = point.y;

                relX = relX*30 + 150;
                relY = relY*(-30) + 150;

                ctx.beginPath();

                //ctx.fillStyle = point.result ? "green" : "red";
                ctx.drawImage(point.result ? correctImage : wrongImage, relX, relY, 30, 30);
                //ctx.arc(relX, relY,3, 0, 2*Math.PI);
                ctx.fill();
                ctx.stroke();
                ctx.closePath();
            },
            drawZone: function(canvasId, r) {
                let canvas = document.getElementById(canvasId);
                let context = canvas.getContext("2d");
                const width = canvas.width;
                const height = canvas.height;

                context.clearRect(0, 0, width, height);
//прямоугольник
                context.beginPath();
                context.rect(0.5*width, 0.27*height, 0.46*width, 0.23*height);
                context.closePath();
                context.strokeStyle = "dodgerblue";
                context.fillStyle = "dodgerblue";
                context.fill();
                context.stroke();

// сектор
                context.beginPath();
                context.moveTo(0.5*width, 0.5*height);
                context.arc(0.5*width, 0.5*height, 0.23*height, 5*Math.PI/2 , 3*Math.PI);
                context.closePath();
                context.strokeStyle = "dodgerblue";
                context.fillStyle = "dodgerblue";
                context.fill();
                context.stroke();

//треугольник
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

//отрисовка осей
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

// деления
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
                context.stroke();
                context.closePath();
            },

            validateFromGraph: function () {
                let canvas = document.getElementById("zoneCanvas");
                let rect = canvas.getBoundingClientRect();
                this.point.x = event.clientX - rect.right + rect.width / 2;
                this.point.y = rect.bottom - event.clientY - rect.height / 2;

                this.point.x = (this.point.x)/30;
                this.point.y = (this.point.y)/30;

                this.updatePoints();

                // eslint-disable-next-line no-console
                console.log("X: "+this.point.x);
                // eslint-disable-next-line no-console
                console.log("Y: "+this.point.y);
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
        background:oldlace;
        width: 100%;
        max-width: 1200px;
        min-height: 100%;
        padding: 10px;
        margin: 0 auto;
        color: #000080;
        font: italic  12pt monospace;
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
        padding: 0.7em 1.5em; /* отступ от текста */
    }

    button:hover {
        background: #000080;
    }

    P.line {
        margin: 30px 15px 5px 60px;
        font-weight: bold;
    }


    .textarea {
        resize: both;      /* изменение размера элемента по горизонтали и вертикали. */
        max-width: 16em;
        max-height: 6em;
        min-width: 8em;
        min-height: 2em;
        width: 16em;
        height: 2em;
        border: 1px solid #000080;
    }

</style>