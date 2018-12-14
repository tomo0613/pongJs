!function(t){t.f[0]=function(e,i){Object.defineProperty(i,"__esModule",{value:!0});var n=t.r(1);document.addEventListener("DOMContentLoaded",function(){var t=document.querySelector("canvas"),e=document.querySelector("#instruction"),i=new n.Core(t);i.reset(),i.drawScene(),i.setListeners({onScore:function(t){i.stop(),i.reset(),function(t){var e=document.querySelector("#"+t+" > .score");e.textContent=Number(e.textContent)+1+""}(t),e.classList.remove("hidden")}}),t.addEventListener("click",function(){i.stopped&&(i.start(500),e.classList.add("hidden"))})})},t.f[1]=function(e,i){Object.defineProperty(i,"__esModule",{value:!0});var n=t.r(2),s=function(){return function(t){var e=this;this.stopped=!0,this.simulationDepth=0,this.simulationCount=0,this.simulationStep=1/120,this.simulationLimit=240,this.entities={ball:null,player:null,computer:null},this.paddleMaxSpeed=700,this.paddleEasing=10,this.paddleOffset=50,this.drawRect=function(t){e.context.fillRect(Math.round(t.boundingRect.left),Math.round(t.boundingRect.top),t.width,t.height)},this.drawScene=function(){e.context.clearRect(0,0,e.canvas.width,e.canvas.height),Object.keys(e.entities).forEach(function(t){return e.drawRect(e.entities[t])})},this.moveBall=function(t){["x","y"].forEach(function(i){e.entities.ball.pos[i]+=e.entities.ball.vel[i]*t,e.entities.ball.vel[i]&&(e.obstacle=[e.entities.player,e.entities.computer].find(function(t){return e.collisionHandler.rectIsOverlap(e.entities.ball,t)}),e.obstacle&&e.collisionHandler.correctPosition(i,e.entities.ball,e.obstacle))})},this.movePaddle=function(t,i){(t.vel.y<0&&t.boundingRect.top>0||t.vel.y>0&&t.boundingRect.bottom<e.canvas.height)&&(t.pos.y+=t.vel.y*i)},this.applyPlayerControls=function(t,i){e.mouseY&&(t.vel.y=Math.valBetween(-e.paddleMaxSpeed,(e.mouseY-t.pos.y)*e.paddleEasing,e.paddleMaxSpeed))},this.applyAiControls=function(t,i){t.vel.y=Math.valBetween(-500,e.entities.ball.vel.y+.2,500)},this.handleCollision=function(){e.collisionHandler.currentObstacle&&(["left","right"].includes(e.collisionHandler.collidingSide)&&(e.entities.ball.vel.x*=-1),["top","bottom"].includes(e.collisionHandler.collidingSide)&&(e.entities.ball.vel.y*=-1),e.entities.ball.vel.y+=e.collisionHandler.currentObstacle.vel.y/2,e.collisionHandler.currentObstacle=null,e.playSound(e.entities.ball.pos.x<100?500:1500)),(e.entities.ball.boundingRect.top<0||e.entities.ball.boundingRect.bottom>e.canvas.height)&&(e.entities.ball.vel.y*=-1),(e.entities.ball.boundingRect.left<0||e.entities.ball.boundingRect.right>e.canvas.width)&&(e.listeners.onScore(e.entities.ball.boundingRect.left<0?"player2":"player1"),e.entities.ball.vel.x*=-1)},this.updatePhysics=function(t){e.applyPlayerControls(e.entities.player,t),e.applyAiControls(e.entities.computer,t),e.movePaddle(e.entities.player,t),e.movePaddle(e.entities.computer,t),e.moveBall(t),e.handleCollision()},this.simulate=function(t){for(e.simulationCount=0,e.simulationDepth+=t;e.simulationDepth>e.simulationStep;)if(e.updatePhysics(e.simulationStep),e.simulationDepth-=e.simulationStep,++e.simulationCount>=e.simulationLimit){e.simulationDepth=0;break}},this.animate=function(t){void 0===t&&(t=performance.now()),e.elapsedTime=(t-(e.prevTimeStamp||performance.now()))/1e3,e.simulate(e.elapsedTime),e.drawScene(),e.prevTimeStamp=t,e.stopped||requestAnimationFrame(e.animate)},this.reset=function(){e.entities.ball.vel.set(0,0),e.entities.ball.pos.set(e.canvas.width/2,e.canvas.height/2),e.entities.player.vel.set(0,0),e.entities.player.pos.set(e.paddleOffset,e.canvas.height/2),e.entities.computer.vel.set(0,0),e.entities.computer.pos.set(e.canvas.width-e.paddleOffset,e.canvas.height/2)},this.start=function(t,i){void 0===t&&(t=200),void 0===i&&(i=0),e.entities.ball.vel.set(t,i),e.stopped=!1,e.animate()},this.stop=function(){e.stopped=!0},this.setListeners=function(t){return e.listeners=t},this.playSound=function(t){e.oscillator=e.audioContext.createOscillator(),e.oscillator.connect(e.audioContext.destination),e.oscillator.type="square",e.oscillator.frequency.value=t,e.oscillator.start(),e.oscillator.stop(e.audioContext.currentTime+.02)},this.canvas=t,this.context=t.getContext("2d"),this.context.fillStyle="#FFF",this.entities.ball=new n.Rect(10,10),this.entities.player=new n.Rect(10,100),this.entities.computer=new n.Rect(10,100),this.entities.player.pos.set(this.paddleOffset,this.canvas.height/2),this.entities.computer.pos.set(this.canvas.width-this.paddleOffset,this.canvas.height/2),t.addEventListener("mousemove",function(t){return e.mouseY=t.offsetY}),this.collisionHandler=new n.CollisionHandler,this.audioContext=new AudioContext}}();i.Core=s},t.f[2]=function(e,i){Object.defineProperty(i,"__esModule",{value:!0});var n=t.r(3),s=function(){function t(t,e){this.pos=new n.Vec,this.vel=new n.Vec,this.width=t,this.height=e}return Object.defineProperty(t.prototype,"boundingRect",{get:function(){return{top:this.pos.y-this.height/2,left:this.pos.x-this.width/2,bottom:this.pos.y+this.height/2,right:this.pos.x+this.width/2}},enumerable:!0,configurable:!0}),t}();i.Rect=s;var o=function(){function t(){this.sides={x:["right","left"],y:["bottom","top"]},this.collidingSide="",this.rectIsOverlap=function(t,e){return t.boundingRect.left<e.boundingRect.right&&t.boundingRect.top<e.boundingRect.bottom&&t.boundingRect.bottom>e.boundingRect.top&&t.boundingRect.right>e.boundingRect.left}}return t.prototype.correctPosition=function(t,e,i){this.currentObstacle=i,this.collidingSide=this.sides[t][e.vel[t]>0?0:1],this.oppositeSide=this.sides[t][e.vel[t]>0?1:0],this.sideOffset=e["x"==t?"width":"height"]/2,this.directionSign=0==this.sides[t].indexOf(this.collidingSide)?-1:1,e.pos[t]=i.boundingRect[this.oppositeSide]+this.sideOffset*this.directionSign},t}();i.CollisionHandler=o},t.f[3]=function(t,e){Object.defineProperty(e,"__esModule",{value:!0});var i=function(){return function(t,e){void 0===t&&(t=0),void 0===e&&(e=0);var i=this;this.set=function(t,e){i.x=t,i.y=e},this.set(t,e)}}();e.Vec=i,Math.valBetween=function(t,e,i){return Math.min(i,Math.max(t,e))}},t.r(0)}($fsx);