const simulador = {
    template: `<div>
            <div class="arriba">
            <h2>Estados de los Procesos</h2>
            <div class="BotonEmpezar">
            <div class="InputQuantum">
                <div class="input-data">
                <input type="number" required class="inpQuantum" v-model="quantum"/>
                <label>QUANTUM</label>
                </div>
            </div>
            <div class="container" v-on:click="accionBoton">
                <div id="app">
                <div class="pause">
                    <div class="line line_1"></div>
                    <div class="line line_2"></div>
                </div>
                <div class="play active">
                    <div class="line line_1"></div>
                    <div class="line line_2"></div>
                    <div class="line line_3"></div>
                </div>
                </div>
            </div>
            </div>
        </div>

        <div class="contenedor">
            <section class="estadoProceso">
            <div class="listos">
                <h3 class="tituloTabla">Procesos Listos [Tiempo: {{tiempo}}]</h3>
                <table class="tablaProcesos" id="tableListos">
                <thead>
                    <tr class="headertable">
                        <th>PID</th>
                        <th>Nombre</th>
                        <th>Prioridad</th>
                        <th>Rafaga</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="pr, i in listos":key="i">

                        <td>{{pr.pid}}</td>
                        <td>{{pr.nombre}}</td>
                        <td>{{pr.prioridad}}</td>
                        <td>{{pr.nombre.length}}</td>
                    </tr>
                </tbody>
                </table>
            </div>
            </section>

            <section class="estadoProceso">
            <div class="ejecucion">
                <ul>
                <h3>Proceso en Ejecucion</h3>
                <li>PID = {{proceso.pid}}</li>
                <li>nombre = {{proceso.nombre}}</li>
                <li>Rafaga = {{ proceso.nombre.length }}</li>
                <li>Tiempo Restante = {{proceso.restante}}</li>
                </ul>
            </div>
            </section>
            <section class="estadoProceso">
            <div class="terminado">
                <h3 class="tituloTabla">Procesos Terminados</h3>
                <table class="tablaProcesos" id="tableTerminado">
                <thead>
                    <tr class="headertable">
                    <th>#id</th>
                    <th>Nombre</th>
                    <th>Tiempo de Finalizacion</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="tr, i in finalizados":key="i">
                    <td> {{tr.pid}}</td>
                    <td>{{tr.nombre}}</td>
                    <td>{{tr.tiempoFin}}</td>
                    </tr>
                </tbody>
                </table>
            </div>
            </section>
        </div>
    </div>`,
  data() {
    return {
        boton: true,
        quantum: 0,
        tiempo: 0,
        procesos: [],
        listos: [],
        finalizados: [],
        proceso: {
            pid: "",
            nombre: "",
            usuario: "",
            prioridad: "",
            iteraciones: 0,
            tiempoLlegada: -1,
            tiempoFin: 0,
            rafaga: 0,
            restante: 0
        },
    }
  },
  methods: {
    capturarProcesos(){
        fetch('./json/procesos.json')
        .then(response => response.json().then(data =>{
           data.forEach(element => {
                this.procesos.push(JSON.parse(JSON.stringify(element)))
           });
           this.listos = this.procesos;
        }))
    },
    simulacionNoExpulsivos(){
        this.proceso.pid = this.listos[0].pid;
        this.proceso.nombre = this.listos[0].nombre;
        this.proceso.rafaga = this.listos[0].nombre.length;
        this.proceso.restante = this.proceso.rafaga;
        this.listos[0].tiempoLlegada = this.tiempo;
        let hilo = setInterval(()=>{
            if(this.proceso.restante>0){
                this.proceso.restante--;
            } else {
                this.listos[0].tiempoFin = this.tiempo;
                this.finalizados.push(this.listos[0]);
                this.listos.splice(0,1);
                clearInterval(hilo);
            }
            this.tiempo++;
        }, 1000);
    },
    simulacionExpulsivos(){
        this.proceso.pid = this.listos[0].pid;
        this.proceso.nombre = this.listos[0].nombre;
        this.proceso.rafaga = this.listos[0].nombre.length;
        this.proceso.restante = this.proceso.rafaga;
        this.listos[0].tiempoLlegada = this.tiempo;
        let cont = 0;
        let hilo = setInterval(() => {
            if (cont<this.quantum && this.proceso.restante>0){
                this.proceso.restante--;
                cont++;
            } else if (cont==this.quantum && this.proceso.restante>0){
                this.listos.push(this.listos[0]);
                this.listos.splice(0,1);
                cont=0;
                clearInterval(hilo);
            } else {
                this.listos[0].tiempoFin = this.tiempo;
                this.finalizados.push(this.listos[0]);
                this.listos.splice(0,1);
                clearInterval(hilo);
            }
            this.tiempo++;
        }, 1000);
    }, 
    async accionBoton(){
        if(this.boton){
            this.boton = false;
            this.comenzar()
        } else {
            this.boton = true;
        }
    },
    async comenzar(){
        if(this.listos[0].prioridad=="1") this.simulacionNoExpulsivos();
        else this.simulacionExpulsivos();
    }
  },
  mounted() {
    this.capturarProcesos()
  },
}

new Vue({
    el: 'main',
    data: {

    },
    components: {
        simulador: simulador
    }
})