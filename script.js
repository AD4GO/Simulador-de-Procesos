const simulador = {
    template: `<div>
            <div class="arriba">
            <h2>Estados de los Procesos</h2>
            <div class="BotonEmpezar">
            <div class="InputQuantum">
                <div class="input-data">
                <input type="number" required class="inpQuantum" v-model="th"/>
                <label>TH (ms)</label>
                </div>
            </div>
            <div class="InputQuantum">
                <div class="input-data">
                <input type="number" required class="inpQuantum" v-model="quantum"/>
                <label>QUANTUM (ms)</label>
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
                        <td>{{(pr.nombre.length * th)/1000}}</td>
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
                <li>Rafaga = {{(proceso.nombre.length * th)/1000}}</li>
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
        <h2>Reportes</h2>
    <div class="contenedor2">
      <section class="estadoProceso">
        <div class="ListEjecucion">
          <h3 class="tituloTabla">Listado de ejecución</h3>
          <table class="tablaProcesos" id="tableTerminado">
            <thead>
              <tr class="headertable">
                <th>P</th>
                <th>TL</th>
                <th>R</th>
                <th>P.R</th>
                <th>T.R</th>
                <th>T.F</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="rp, i in finalizados":key="i">
                <td>{{rp.nombre}}</td>
                <td>{{rp.tiempoLlegada}}</td>
                <td>{{(th*rp.nombre.length)/1000}}</td>
                <td>{{rp.prioridad}}</td>
                <td>{{rp.tiempoFin-rp.tiempoLlegada}}</td>
                <td>{{rp.tiempoFin}}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section class="estadoProceso">
        <div class="NoExpuls">
          <h3 class="tituloTabla">Listado de procesos (no expulsivos)</h3>
          <table class="tablaProcesos" id="tableTerminado">
            <thead>
              <tr class="headertable">
                <th>P</th>
                <th>TL</th>
                <th>R</th>
                <th>P.R</th>
                <th>T.R</th>
                <th>T.F</th>
              </tr>
            </thead>
            <tbody>
            <tr v-for="rp, i in finalizados":key="i" v-if="rp.prioridad=='0'">
                <td>{{rp.nombre}}</td>
                <td>{{rp.tiempoLlegada}}</td>
                <td>{{(th*rp.nombre.length)/1000}}</td>
                <td>{{rp.prioridad}}</td>
                <td>{{rp.tiempoFin-rp.tiempoLlegada}}</td>
                <td>{{rp.tiempoFin}}</td>
            </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
    <div class="graficaList">
      <ul class="definiciones">
        <li>P: Nombre proceso</li>
        <li>T.L: Timepo de llegada</li>
        <li>R: Rafaga</li>
        <li>P.R: Prioridad asignada</li>
        <li>T.R: TurnaRound</li>
        <li>T.F: Tiempo de finalizacón</li>
      </ul>
      <section class="content">
        <h2>Grafico de comportamiento</h2>
        <h3 class="tituloGrafica">Proceso vs TurnaRound</h3>
        <canvas id="myChart" height="100" width="200"> </canvas>
      </section>
    </div>
    </div>`,
  data() {
    return {
        boton: true,
        quantum: 0,
        tiempo: 0,
        cont: 0,
        th: 0,
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
            restante: 0,
            iteraciones: 0
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
        if(this.listos[0].restante>0){
            this.listos[0].restante--;
        } else {
            this.listos[0].tiempoFin = this.tiempo;
            this.listos[0].iteraciones++;
            this.finalizados.push(this.listos[0]);
            this.listos.splice(0,1);
            this.proceso.pid = this.listos[0].pid;
            this.proceso.nombre = this.listos[0].nombre;
            this.proceso.rafaga = (this.listos[0].nombre.length * this.th)/1000;
            if(this.listos[0].restante==0)
                this.listos[0].restante = this.proceso.rafaga;
        }
        this.proceso.restante = this.listos[0].restante;
        this.tiempo++;
    },
    simulacionExpulsivos(){
        if (this.cont<(this.quantum/1000) && this.listos[0].restante>0){
            this.listos[0].restante--;
            this.cont++;
        } else if (this.cont==(this.quantum/1000) && this.listos[0].restante>0){
            this.listos[0].iteraciones++;
            this.listos.push(this.listos[0]);
            this.listos.splice(0,1);
            this.cont=0;
            this.proceso.pid = this.listos[0].pid;
            this.proceso.nombre = this.listos[0].nombre;
            this.proceso.rafaga = (this.listos[0].nombre.length * this.th)/1000;
            if(this.listos[0].restante==0)
                this.listos[0].restante = this.proceso.rafaga;
        } else {
            this.listos[0].iteraciones++;
            this.listos[0].tiempoFin = this.tiempo;
            this.finalizados.push(this.listos[0]);
            this.listos.splice(0,1);
            this.proceso.pid = this.listos[0].pid;
            this.proceso.nombre = this.listos[0].nombre;
            this.proceso.rafaga = (this.listos[0].nombre.length * this.th)/1000;
            if(this.listos[0].restante==0)
                this.listos[0].restante = this.proceso.rafaga;
        }
        this.proceso.restante = this.listos[0].restante;
        this.tiempo++;
    }, 
    async accionBoton(){
        var interval
        if(this.boton){
            this.boton = false;
            interval = setInterval(()=>{
                //Para el primer proceso
                if (this.tiempo == 0 ){
                    this.proceso.pid = this.listos[0].pid;
                    this.proceso.nombre = this.listos[0].nombre;
                    this.proceso.rafaga = (this.listos[0].nombre.length * this.th)/1000;
                    this.listos[0].restante = this.proceso.rafaga;
                    this.proceso.restante = this.listos[0].restante;
                    this.listos[0].tiempoLlegada = this.tiempo;
                } else if (this.listos[0].tiempoLlegada==-1)
                    this.listos[0].tiempoLlegada = this.tiempo;
                if(this.listos[0].prioridad=="1") this.simulacionNoExpulsivos();
                else this.simulacionExpulsivos();

                if(this.listos.length==0 || this.boton){
                    clearInterval(interval);
                }
            }, 100);
        } else {
            this.boton = true;
        }
        if(this.listos.length==0){
            this.graficar();
        }
    }
  },
  graficar(){
    const procesos = []
    const turnRound = []
    for (const process of this.finalizados) {
        procesos.push(process.nombre);
        turnRound.push(process.tiempoFin-process.tiempoLlegada);
    }
    console.log(procesos);
    console.log(turnRound);
    const ctx = document.getElementById('myChart');
    Chart.defaults.color = '#fff';
    const myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels : procesos,
            datasets: [{
                label: '',
                data: turnRound,
                backgroundClor: [
                    '#111'
                ],
            }]
        }
    })
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