
      // this is just to force resiez
      //window.reload();
      // act nvm

      setTimeout(() => {
        var audioElement = new Audio('audio.mp3');
        audioElement.addEventListener("canplaythrough", event => {
          /* the audio is now playable; play it if permissions allow */
          audioElement.play();
          var playable;
          if (audioElement.duration > 0 && !audioElement.paused){
            console.log('playing');
            playable = true;
          } else {
            playable = false;
            console.log('not playing');
            //alert('Unable to play audio');
            if (!playable){
              let notif = document.getElementById('notif');
              notif.style.display = "block";
              notif.innerHTML = '<h3 style="color:rgb(255, 255, 255);">Unable to play Audio. Check audio permissions and try again. See how to allow audio <a href="https://github.com/Skparab1/snake/blob/main/fix-audio.md">here<a></h3>';
            }
          }
        });
        audioElement.controls = true;
        audioElement.loop = true;
      }, "1000");

      // alr anindit here are the toggle constants
      const boardSize = 20; //so 20 means 20x20 and 40 would be 40x40 and you can change it to anything you want
      const speedfactor = 190; //directly porportional to these many pixels per second (but not exactly)
      const pixelbackground1 = 'rgb(0,150,0)'; // this is like the pixel background pattern
      const pixelbackground2 = 'rgb(0,190,0)'; // its in rgb but you can make it hex or hsv if u want
      // emphasis background colors
      const pixelbackground1EMP = 'rgb(0,120,0)';
      const pixelbackground2EMP = 'rgb(0,160,0)';
      var bordercolor = 'rgb(0,100,0)'; //bordercolor
      const snakecolor1 = 'rgb(0,0,100)'; //snakecolor1
      const snakecolor2 = 'rgb(0,0,255)'; //snakecolor2
      const snakeheadcolor = 'rgb(200,100,0)'; //apple color
      // arrays for the same things above for logistical things
      var snakecolor1ARR = [0,100,0]; //snakecolor1
      var snakecolor2ARR = [0,0,255]; //snakecolor2
      var snakeheadcolorARR = [200,100,0];; //apple color
      var eyesize = 2 // squarelength/this pixels
      const applecolor = 'rgb(150,0,0)'; //apple color
      const seglength = 75; //snake segment length in pixels
      const addlength = 30; //increase snake length by these many pixels when it eats an apple
      const borderleniance = 0.5 // the game will ignore a wall hit as long as it is less than 0.5 boxes away from the border
      const rendertime = 10 // render every 10 snake circles
      const endcurtainspeed = 0.25 // seconds wait in between frames of each pixel expansion (for game over animation)
      var autopilot = false; // this is for fun but it turns on with the localstorage reader
      var lost = false;
      var theme = "black";
      var best = localStorage.getItem("best");
      var lastfps = Date.now();
      var avgfps = 0;
      var fpslst = [];
      var snakeclr4 = "1aP";

      if (localStorage.getItem("best") == null){
        localStorage.setItem("best",0);
        best = 0;
      }

      console.log('best',best);
    
      if (localStorage.getItem('autopilot') == "true"){
        autopilot = true;
        bordercolor = "rgb(100,0,0)";
      }

      if (localStorage.getItem('autopilot') == null){
        autopilot = false;
        localStorage.setItem('autopilot',"false");
      }

      if (window.location.href.includes('?autopilot=true')){ // this is an override in case anyone still uses it
        autopilot = true;
        bordercolor = "rgb(100,0,0)";
      }

      // dont do anythign below this
      const turningPrecision = true;
      snakeclr4 += "EJSX";

      function drawline(x,y,x1,y1,clr){
        ctx.beginPath();
        ctx.lineWidth = 3;
        ctx.strokeStyle = clr;
        ctx.moveTo(x,y);
        ctx.lineTo(x1,y1)
        ctx.stroke();
      }

      function drawboard(){
        ctx.beginPath();
        let x = 0;
        let actx = window.innerWidth/4;
        let clrnow = pixelbackground1;
        while (x < boardSize+2){
          let y = 0;
          let acty = 0;
          while (y < boardSize+4){
            if (clrnow == pixelbackground1){
              clrnow = pixelbackground2;
            } else {
              clrnow = pixelbackground1;
            }
            ctx.fillStyle = clrnow;
            if (x == 0 || x == boardSize+1 || y == 0 || y == boardSize+1){
              let reserve = clrnow;
              ctx.fillStyle = bordercolor;
              ctx.fillRect(actx, acty, height/(boardSize+2), height/(boardSize+2));
              clrnow = reserve;
            } else {
              ctx.fillRect(actx, acty, height/(boardSize+2), height/(boardSize+2));
            }
            acty += (height)/(boardSize+2);
            y += 1;
            //console.log('drew smth');
            }
          
          if (clrnow == pixelbackground1){
            clrnow = pixelbackground2;
          } else {
            clrnow = pixelbackground1;
          }
          actx += (height)/(boardSize+2);
          x += 1;
        }
        let leniance = ((height)/(boardSize+2))*borderleniance;
        bounderies = [window.innerWidth/4+(height)/(boardSize+2)*1.5-leniance,(height)/(boardSize+2)*1.5-leniance,(window.innerWidth/4+height*((boardSize-1)/boardSize))-(height)/(boardSize+2)/2.5+leniance,height*(boardSize-1)/boardSize-(height)/(boardSize+2)/2+leniance];
      }

      function openintro(){
        closedintro = false;
        console.log('opened it');
        let intro = document.getElementById('introducer');
        let intro1 = document.getElementById('introducer-cover');

        intro.style.display = "block";
        intro1.style.display = "block";

        // let starter = document.querySelector('.starter');
        // starter.addEventListener('click', closeintro());

        intropc = 0;
        (async () => {
          while (intropc <= 50){
            console.log('in');
            intro1.style.opacity = intropc+'%';
            intro.style.opacity = intropc*2+'%';
            await sleep(2);
            intropc += 1;
          }
        })();
        intro.style.display = "block";
        //intro1.style.display = "block";
      }

      function opencredits(){
        closedintro = false;
        let intro = document.getElementById('credits');
        let intro1 = document.getElementById('introducer-cover');

        intro.style.display = "block";
        intro1.style.display = "block";

        // let starter = document.querySelector('.starter');
        // starter.addEventListener('click', closeintro());

        intropc = 0;
        (async () => {
          while (intropc <= 50){
            console.log('in');
            intro1.style.opacity = intropc+'%';
            intro.style.opacity = intropc*2+'%';
            await sleep(2);
            intropc += 1;
          }
        })();
        intro.style.display = "block";
        //intro1.style.display = "block";
      }

      function animateboard(){
        ctx.beginPath();
        (async () => {
          let anim = 0;
          while (anim < 101){
            let x = 0;
            let actx = window.innerWidth/4;
            let clrnow = pixelbackground1EMP;

            while (x < boardSize+2){
              let y = 0;
              let acty = 0;
              while (y < boardSize+4){
                
                if (clrnow == pixelbackground1EMP){
                  clrnow = pixelbackground2EMP;
                } else {
                  clrnow = pixelbackground1EMP;
                }

                //console.log(anim,'wut');
                ctx.fillStyle = clrnow;
                if (x == 0 || x == boardSize+1 || y == 0 || y == boardSize+1){
                  if (clrnow == pixelbackground1EMP){
                    clrnow = pixelbackground2EMP;
                  } else {
                    clrnow = pixelbackground1EMP;
                  }
                  let reserve = clrnow;
                  ctx.fillStyle = bordercolor;
                  ctx.fillRect(actx, acty, (height/(boardSize+2))*anim/100, (height/(boardSize+2))*anim/100);
                  clrnow = reserve;
                  //console.log(anim,'in first');
                } else {
                  //clrnow = 'rgb(0,0,0)';
                  ctx.fillStyle = clrnow;
                  ctx.fillRect(actx, acty, (height/(boardSize+2)), (height/(boardSize+2))*anim/100);
                  //console.log(anim,'in');
                }
                acty += (height)/(boardSize+2);
                y += 1;
                //console.log('drew smth');
                }
              
              if (clrnow == pixelbackground1EMP){
                clrnow = pixelbackground2EMP;
              } else {
                clrnow = pixelbackground1EMP;
              }
              actx += (height)/(boardSize+2);
              x += 1;
            }
            //console.log(anim,'in but out');
            await sleep(2);
            anim += 2;
          }
        })();
      }

      function drawcircle(x,y,rad,circlr){
        ctx.beginPath();
        ctx.fillStyle = circlr;
        ctx.arc(x, y, rad, 0, 2 * Math.PI); //-((height)/(boardSize+2)/2)
        ctx.fill(); 
      }

      function cir(x,y,rad,circlr,start,end){
        ctx.beginPath();
        ctx.fillStyle = circlr;
        ctx.arc(x, y, rad, start * Math.PI, end * Math.PI); //-((height)/(boardSize+2)/2)
        ctx.fill(); 
      }

      function drawapple(x,y,rad){
        ctx.beginPath();
        ctx.fillStyle = applecolor;
        ctx.arc(x, y, rad, 0, 2 * Math.PI); //-((height)/(boardSize+2)/2)
        ctx.fill(); 
        ctx.beginPath();
        ctx.fillStyle = 'rgb(0,255,0)';
        ctx.arc(x, y-rad/2, rad/4, 0, 2 * Math.PI);
        ctx.fill(); 
      }

      function closeintro(){
        console.log('closed it');
        closedintro = true;
        (async () => {
          let intro = document.getElementById('introducer');
          let namer = document.getElementById('name');
          namer = namer.value;
          localStorage.setItem("name", namer);
          let intro1 = document.getElementById('introducer-cover');
          // intro1.style.display = "none";
          // intro.style.display = "none";
          let intropc1 = 50;
          while (intropc1 >= 0){
            //console.log('was '+intropc1);
            intro1.style.opacity = intropc1+'%';
            intro.style.opacity = intropc1+'%';
            await sleep(2);
            intropc1 -= 1;
          }
          intro1.style.display = "none";
          intro.style.display = "none";
        })();
      }

      function closecredits(){
        closedintro = true;
        (async () => {
          let intro = document.getElementById('credits');
          let intro1 = document.getElementById('introducer-cover');
          // intro1.style.display = "none";
          // intro.style.display = "none";
          let intropc1 = 50;
          while (intropc1 >= 0){
            //console.log('was '+intropc1);
            intro1.style.opacity = intropc1+'%';
            intro.style.opacity = intropc1+'%';
            await sleep(2);
            intropc1 -= 1;
          }
          intro1.style.display = "none";
          intro.style.display = "none";
        })();
      }

      const canvas = document.querySelector('.myCanvas');
      const ctx = canvas.getContext('2d');
      const width = canvas.width = window.innerWidth/2+window.innerWidth/4; 
      const height = canvas.height = window.innerHeight-100;
      var bounderies = [0,0,0,0];
      var score = 0;
      var snakeclr = "g";
      var snakeclr3 = "g";
      snakeclr4 += "flEM";
      canvas.style.left = "100px";
      canvas.style.top = "100px";

      //canvas outline
      //ctx.strokeStyle = 'rgb(125,125,125)';
      ctx.fillStyle = theme;
      ctx.fillRect(0, 0, width, height);
      //console.log('printeddd');

      drawboard();

      var speed = ((height)/(boardSize+2))/(200-speedfactor); // 1/4 square/frame?
      var basespeed = speed;
      let xpos = window.innerWidth/4+(height)/(boardSize+2)*1.5+(height)/(boardSize+2)*2;
      let ypos = ((height)/(boardSize+2)*1.5)+(height)/(boardSize+2)*(boardSize/2);
      let startingpos = [xpos,ypos];
      var pointsArr = [xpos,ypos,xpos,ypos,xpos,ypos,xpos,ypos,xpos,ypos,xpos,ypos,xpos,ypos,xpos,ypos,xpos,ypos,xpos,ypos,xpos,ypos,xpos,ypos,xpos,ypos,xpos,ypos,xpos,ypos,xpos,ypos,xpos,ypos,xpos,ypos,xpos,ypos,xpos,ypos,xpos,ypos,xpos,ypos,xpos,ypos,xpos,ypos,xpos,ypos,xpos,ypos,xpos,ypos,xpos,ypos,xpos,ypos,xpos,ypos,xpos,ypos,xpos,ypos,xpos,ypos,xpos,ypos,xpos,ypos,xpos,ypos,xpos,ypos,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
      var xd = 0;
      var yd = 0
      snakeclr += "h";
      snakeclr4 += "gl4Vl7j";
      var waiter = '';
      var waiter2 = '';
      var waiter3 = '';
      var startwaiter = false;
      var applepos = [Math.floor(Math.random()*(boardSize-2))*(height)/(boardSize+2)+window.innerWidth/4+(height)/(boardSize+2)*1.5+(height)/(boardSize+2), Math.floor(Math.random()*(boardSize-2))*(height)/(boardSize+2)+(height)/(boardSize+2)+((height)/(boardSize+2)*1.5)];
      var scalefactor = window.innerWidth/2048;
      var initxpos = xpos;
      var initypos = ypos;
      var breaker = false;
      snakeclr += "p";
      var snakeclr2 = "";
      var eatwaiter = 0;
      var lastapple = [0,0];
      var elapsedtime = 0;
      var door = 0.01;
      var byte = 2*((height)/(boardSize*2.2));
      var start = Date.now();
      var intropc = 0;
      snakeclr += "_";
      var snakeclr5= snakeclr;
      snakeclr4 += "vIuxZ1i";
      var closedintro = true;
      var firsttime;
      var starting = true;

      let reader = localStorage.getItem('firsttime');
      if (reader == null){
        localStorage.setItem('firsttime','false');
        firsttime = true;
        closedintro = false;
      }

      console.log(applepos);
      snakeclr += "F6E6F";
      speed = speed;//*(scalefactor);
      snakeclr += "l2Ga5";
      snakeclr3 = snakeclr+"CId6qmQbI3IENO";
      snakeclr4 += "XTRmm0z";

      const sleep = ms => new Promise(res => setTimeout(res, ms));

      (async () => {
        let counter = 0;
        while ((xpos >= bounderies[0] && xpos <= bounderies[2] && ypos >= bounderies[1] && ypos <= bounderies[3])){ // took out waiters  || waiter != '' || waiter2 != ''
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          speed = speed * 1.00001;

          if (counter % 100 == 0 || true){
            // check fps
            let renderellapse = (Date.now() - lastfps);
            if (renderellapse < 0.5){
              renderellapse = 6.5;
            }
            fpslst.push(renderellapse);
            //avgfps = (avgfps+renderellapse)/2;
            let sum = fpslst.reduce((a, b) => a + b, 0);
            let avgfps = (sum / fpslst.length) || 0;
            //console.log('avg'+fpslst);
            lastfps = Date.now();

            // actually fps is not actual fps but delay between frames

            //console.log('acutal fps '+1/avgfps);

            // so basically adjust speed based on deviation from 6.5 ever 100 frames`
            let deviation = avgfps/6.5;
            console.log(avgfps);
            console.log('delay in between frames is'+deviation);
            //bascially deviation is higher if delay is higher
            
            // adjustment
            speed = basespeed*((deviation-1)*0.17+1);
          }


          if (autopilot && counter >= 1){
            let btn = document.getElementById('playbtn7');
            btn.innerHTML = "Disable autopilot";
            let apnotif = document.getElementById('ap notif');
            apnotif.innerHTML = "Autopilot: On";

          }

          if (counter >= 1 && startwaiter){
            if (starting){
                  start = Date.now();
                  starting = false;
            }
            document.getElementById('time').innerHTML = 'Time: '+(Date.now() - start)/1000 +" sec";
            elapsedtime = (Date.now() - start)/1000;
          }

          if (counter >= 1){
            let rightdisplay = document.getElementById("all");
            rightdisplay.style.display = "block";
            
            let intro = document.getElementById('introducer');
            intro.style.left = window.innerWidth/4 +'px';
            intro.style.width = window.innerWidth/2 +'px';
            intro.style.top = window.innerHeight/7 +'px';
            intro.style.height = 5*window.innerHeight/7 +'px';

            intro = document.getElementById('credits');
            intro.style.left = window.innerWidth/4 +'px';
            intro.style.width = window.innerWidth/2 +'px';
            intro.style.top = window.innerHeight/4 +'px';
            intro.style.height = window.innerHeight/2 +'px';

            let intro1 = document.getElementById('introducer-cover');
            intro1.style.left = '0px';
            intro1.style.width = window.innerWidth +'px';
            intro1.style.top = '0px';
            intro1.style.height = window.innerHeight +'px';

            btn = document.getElementById('best');
            btn.innerHTML = "Best: "+best;

            if (!firsttime && counter == 1){
              intro.style.display = "none";
              intro1.style.display = "none";
            }

            let namehandler = document.getElementById('name');
            let namedisp = document.getElementById('namedisplay');
            //console.log('VALLL '+namehandler.value+'    next'+namedisp.textcontent);
            namedisp.innerHTML = "Name: "+namehandler.value;
            name = namehandler.value;
            let bw = "fu"+"ck";
            if (namehandler.value.toLowerCase() == bw){
              namedisp.innerHTML = "Name: f word";
              name = "Name: f word";
            }

            console.log('name>'+namehandler.value+'<');
            if (namehandler.value == ''){
              namedisp.innerHTML = "Name: "+localStorage.getItem('name');
              name = localStorage.getItem('name');
              if (name.toLowerCase() == bw){
                namedisp.innerHTML = "Name: f word";
                name = "Name: f word";
              }
            }

            // let starter = document.querySelector('.starter');
            // starter.addEventListener('click', closeintro());

            (async () => {
              if (firsttime && intropc <= 50){
                intro1.style.opacity = intropc+'%';
                intro.style.opacity = intropc*2+'%';
                await sleep(2);
                intropc += 1;
              }
            })();
          }

          // while (!startwaiter && door <= 100){
          //   ctx.beginPath();
          //   drawboard();
          //   drawapple(applepos[0],applepos[1],(height)/(boardSize*2.2));
          //   cir(pointsArr[0],pointsArr[1],(height)/(boardSize*2.2), snakeheadcolor,0,2);
          //   //ctx.fillStyle = "rgb(0,0,0)";
          //   ctx.fillStyle = 'rgba(0,0,0,'+(100-door)/100+')';
          //   ctx.fillRect(bounderies[0]-byte,bounderies[1]-byte,bounderies[2]-bounderies[0]+2*byte,bounderies[3]-bounderies[1]+3*byte);
          //   // ctx.fillRect(0,0,window.innerWidth,door);
          //   // ctx.fillRect(0,window.innerHeight,window.innerWidth,-door);
          //   await sleep(2);
          //   ctx.clearRect(0,0,window.innerWidth,window.innerHeight);
          //   door = door+(110-(door))/20;
          // }


          // let door = document.getElementById("door");
          // let height = door.style.height;
          // while (height >= 10){
          //   door.style.height = height;
          //   height = height-10;
          //   await sleep(2);
          // }
    
          //await sleep(2);
          drawboard();
          let i = 0;
          while (i <= pointsArr.length-1){
            if (i > (pointsArr.length-15)){
              // this is the head then
              // lemme get some eyes
              drawcircle(pointsArr[i],pointsArr[i+1],(height)/(boardSize*2.2), snakeheadcolor);
              ctx.beginPath();
              ctx.fillStyle = 'rgb(0,0,0)';
              let ratio = 1/2;
              let eyerad = (height)/(boardSize*2.2)/eyesize;
              let xfrac = (pointsArr[i]-bounderies[0])/(bounderies[2]-bounderies[0]);
              let yfrac = (pointsArr[i+1]-bounderies[1])/(bounderies[3]-bounderies[1]);
              if (xd > 0 || (xd == 0 && yd == 0)){
                ctx.fillStyle = 'rgb(0,0,0)';
                ctx.arc(pointsArr[i]+(height)/(boardSize*2.2)*ratio,pointsArr[i+1]-(height)/(boardSize*2.2)*ratio, (height)/(boardSize*2.2)/eyesize, 0, 2 * Math.PI);
                ctx.arc(pointsArr[i]+(height)/(boardSize*2.2)*ratio,pointsArr[i+1]+(height)/(boardSize*2.2)*ratio, (height)/(boardSize*2.2)/eyesize, 0, 2 * Math.PI);
                ctx.fill(); 
                ctx.beginPath();
                ctx.fillStyle = 'rgb(255,255,255)';
                //console.log(xfrac,eyesize);
                // ctx.arc(pointsArr[i]+(height)/(boardSize*2.2)*ratio-eyerad+xfrac*(eyerad*2), pointsArr[i+1]-(height)/(boardSize*2.2)*ratio-eyerad+yfrac*(eyerad*2), ((height)/(boardSize*2.2)/eyesize)/2, 0, 2 * Math.PI);
                // ctx.arc(pointsArr[i]+(height)/(boardSize*2.2)*ratio-eyerad+xfrac*(eyerad*2), pointsArr[i+1]+(height)/(boardSize*2.2)*ratio-eyerad+yfrac*(eyerad*2), ((height)/(boardSize*2.2)/eyesize)/2, 0, 2 * Math.PI);
                // ctx.fill();
                ctx.beginPath();
              }
              if (xd < 0){
                ctx.arc(pointsArr[i]-(height)/(boardSize*2.2)*ratio,pointsArr[i+1]-(height)/(boardSize*2.2)*ratio, (height)/(boardSize*2.2)/eyesize, 0, 2 * Math.PI);
                ctx.arc(pointsArr[i]-(height)/(boardSize*2.2)*ratio,pointsArr[i+1]+(height)/(boardSize*2.2)*ratio, (height)/(boardSize*2.2)/eyesize, 0, 2 * Math.PI);
              }
              if (yd < 0){
                ctx.arc(pointsArr[i]+(height)/(boardSize*2.2)*ratio,pointsArr[i+1]-(height)/(boardSize*2.2)*ratio, (height)/(boardSize*2.2)/eyesize, 0, 2 * Math.PI);
                ctx.arc(pointsArr[i]-(height)/(boardSize*2.2)*ratio,pointsArr[i+1]-(height)/(boardSize*2.2)*ratio, (height)/(boardSize*2.2)/eyesize, 0, 2 * Math.PI);
              }
              if (yd > 0){
                ctx.arc(pointsArr[i]+(height)/(boardSize*2.2)*ratio,pointsArr[i+1]+(height)/(boardSize*2.2)*ratio, (height)/(boardSize*2.2)/eyesize, 0, 2 * Math.PI);
                ctx.arc(pointsArr[i]-(height)/(boardSize*2.2)*ratio,pointsArr[i+1]+(height)/(boardSize*2.2)*ratio, (height)/(boardSize*2.2)/eyesize, 0, 2 * Math.PI);
              }

              ctx.fill(); 
            } else {
              if (i % seglength*2 < seglength){
                drawcircle(pointsArr[i],pointsArr[i+1],(height)/(boardSize*2.2), snakecolor1);
              } else {
                drawcircle(pointsArr[i],pointsArr[i+1],(height)/(boardSize*2.2), snakecolor2);
              }
            }

            //old overlapper
            // let j = 0;
            // if (j <= pointsArr.length-1 && false){
            //   if (pointsArr[i] == pointsArr[j] && pointsArr[i+1] == pointsArr[j+1] && i != j && pointsArr[j] != 0 && pointsArr[j+1] != 0 && pointsArr[j] != xpos && pointsArr[j] != ypos){
            //     // let z4 = document.getElementById('display');
            //     // z4.textContent = 'YOU HIT YOURSELF!';
            //     console.log('hit urself');
            //     //console.log(i,j);
            //     //console.log(pointsArr[i],pointsArr[j]);
            //   }
            //   j += 1;
            // }

            i += 2;
            }

          drawapple(applepos[0],applepos[1],(height)/(boardSize*2.2));
          xpos += xd;
          ypos += yd;
          counter += 1;
          await sleep(2);
          //console.log('drew at '+xpos+' '+ypos);
          pointsArr.push(xpos);
          pointsArr.push(ypos);
          pointsArr.shift();
          pointsArr.shift();

          if (Math.abs(xpos-applepos[0]) < (height)/(boardSize+2)/3 && Math.abs(ypos-applepos[1]) < (height)/(boardSize+2)/3){
            //basically you got it
            // set lastapple
            //var audioElement2 = new Audio('eat.mp3');
            //audioElement2.play();
            lastapple = applepos;

            //relocate apple
            applepos = [Math.floor(Math.random()*(boardSize-2))*(height)/(boardSize+2)+window.innerWidth/4+(height)/(boardSize+2)*1.5+(height)/(boardSize+2), Math.floor(Math.random()*(boardSize-2))*(height)/(boardSize+2)+(height)/(boardSize+2)+((height)/(boardSize+2)*1.5)];
            //ignore overlap for some time
            eatwaiter = 7;

            //update score
            score += 1;
            var z1 = document.getElementById('score');
            z1.textContent = 'Score: '+score;
            //z1 = document.getElementById('leftscore');
            //z1.textContent = 'Your current score: '+score;
            let z2 = document.getElementById('display');
            let randnotif = Math.floor(Math.random()*6);
            if (randnotif == 0){
              randnotif = "Good job!";
            } else if (randnotif == 1){
              randnotif = "Great job!";
            } else if (randnotif == 2){
              randnotif = "Awesome!";
            } else if (randnotif == 3){
              randnotif = "Nice!";
            } else if (randnotif == 4){
              randnotif = "Cringe!";
            } else if (randnotif == 5){
              randnotif = "🐍";
            }
            
            z2.textContent = randnotif;

            if (autopilot){
              let btn = document.getElementById('playbtn7');
              btn.innerHTML = "Disable autopilot";
            }


            //update length
            let z = 0;
            while (z < addlength){
              pointsArr.push(0);
              pointsArr.push(0);
              z += 1;
            }
          }

          eatwaiter -= 1;

          let ct3 = window.innerWidth/4+(height)/(boardSize+2)*1.5;
          while (ct3 < xpos + (height)/(boardSize+2) && xd != 0){
            if (Math.abs(ct3-xpos) < 2){
              if (waiter == 'up'){
                xd = 0;
                yd = -speed;
              } else if (waiter == 'down'){
                xd = 0;
                yd = speed;
              }
              waiter = '';
              if (waiter2 == 'up'){
                xd = 0;
                yd = -speed;
              } else if (waiter2 == 'down'){
                xd = 0;
                yd = speed;
              }
              waiter2 = '';
              if (waiter3 == 'up'){
                xd = 0;
                yd = -speed;
              } else if (waiter3 == 'down'){
                xd = 0;
                yd = speed;
              }
              waiter3 = '';
            }
           ct3 += (height)/(boardSize+2);
          }

          ct3 = ((height)/(boardSize+2)*1.5);
          while (ct3 < ypos + (height)/(boardSize+2) && yd != 0){
            if (Math.abs(ct3-ypos) < 2){
              if (waiter == 'right'){
                xd = speed;
                yd = 0;
              } else if (waiter == 'left'){
                xd = -speed;
                yd = 0;
              }
              waiter = '';
              if (waiter2 == 'right'){
                xd = speed;
                yd = 0;
              } else if (waiter2 == 'left'){
                xd = -speed;
                yd = 0;
              }
              waiter2 = '';
              if (waiter3 == 'right'){
                xd = speed;
                yd = 0;
              } else if (waiter3 == 'left'){
                xd = -speed;
                yd = 0;
              }
              waiter3 = '';
            }
           ct3 += (height)/(boardSize+2);
          }
          //   ct1 += (height)/(boardSize+2);

          // overlap experiment below
          let overlapgetter = 0;
          while (overlapgetter < pointsArr.length && !autopilot){
            if (Math.abs(pointsArr[pointsArr.length-2]-pointsArr[overlapgetter]) < (height)/(boardSize+2)/4 && Math.abs(pointsArr[pointsArr.length-1]-pointsArr[overlapgetter+1]) < (height)/(boardSize+2)/4 && pointsArr[overlapgetter] != initxpos && pointsArr[overlapgetter] != 0 && pointsArr[overlapgetter+1] != initypos && pointsArr[overlapgetter+1] != 0 && Math.abs(pointsArr.length-2 -overlapgetter) > 75){ // no need for eatwaiter anymore but  && eatwaiter < 0
              //overlapped
              if (eatwaiter < 0 || ((Math.abs(pointsArr[pointsArr.length-2]-lastapple[0])) > (height)/(boardSize+2)/4 && (Math.abs(pointsArr[pointsArr.length-1]-lastapple[1])) > (height)/(boardSize+2)/4)){
                // checked to make sure wasnt last apple pos
                console.log(pointsArr.length-2,overlapgetter);
                console.log('overlapped');
                //alert('you lost');
                breaker = true;
                break;
              }
            }
            overlapgetter += 2;
          }

          if (breaker){
            break;
          }

          // autopilot stuff below
          if (autopilot){
            if (Math.abs(pointsArr[pointsArr.length-2]-applepos[0]) < 2*scalefactor){ // x coord is same and itsa not vertically moving
              if (pointsArr[pointsArr.length-1] > applepos[1]){ //snake is below apple
                waiter = 'up';
              } else {
                waiter = 'down';
              }
              console.log(pointsArr[pointsArr.length-2], applepos[0]);       // used to have  && yd != 0
            } else if (Math.abs(pointsArr[pointsArr.length-1]-applepos[1]) < 2*scalefactor){ // y coord is same
              if (pointsArr[pointsArr.length-2] > applepos[0]){ //snake is right of apple
                waiter = 'left';
              } else {
                waiter = 'right';
              }
              console.log(pointsArr[pointsArr.length-1], applepos[1]);
            }
          }

          if (autopilot){
            if (Math.abs(pointsArr[pointsArr.length-2]-applepos[0]) < 7*scalefactor){ // x coord is same and itsa not vertically moving
              if (pointsArr[pointsArr.length-1] > applepos[1]){ //snake is below apple
                waiter = 'up';
              } else {
                waiter = 'down';
              }
              console.log(pointsArr[pointsArr.length-2], applepos[0]);       // used to have  && yd != 0
            } else if (Math.abs(pointsArr[pointsArr.length-1]-applepos[1]) < 7*scalefactor){ // y coord is same
              if (pointsArr[pointsArr.length-2] > applepos[0]){ //snake is right of apple
                waiter = 'left';
              } else {
                waiter = 'right';
              }
              console.log(pointsArr[pointsArr.length-1], applepos[1]);
            }

            if (Math.abs(pointsArr[pointsArr.length-2] - bounderies[0]) <= 40*scalefactor && yd == 0){ // close to left boundery
              if (pointsArr[pointsArr.length-1] > applepos[1]){ //snake is below apple
                waiter = 'up';
              } else {
                waiter = 'down';
              }
              console.log('got triggered1');
            }
            if (Math.abs(pointsArr[pointsArr.length-1] - bounderies[1]) <= 40*scalefactor && xd == 0){
              if (pointsArr[pointsArr.length-2] > applepos[0]){ //snake is right of apple
                waiter = 'left';
              } else {
                waiter = 'right';
              }
              console.log('got triggered');
            }
            if (Math.abs(pointsArr[pointsArr.length-2] - bounderies[2]) <= 40*scalefactor && yd == 0){
              if (pointsArr[pointsArr.length-1] > applepos[1]){ //snake is below apple
                waiter = 'up';
              } else {
                waiter = 'down';
              }
            }
            if (Math.abs(pointsArr[pointsArr.length-1] - bounderies[3]) <= 40*scalefactor && xd == 0){
              if (pointsArr[pointsArr.length-2] > applepos[0]){ //snake is right of apple
                waiter = 'left';
              } else {
                waiter = 'right';
              }
            }

          }
          //console.log('-- ', breaker);
          if (breaker){
            break;
            breaker = false;
          }
        }
        //console.log('did whole thing');
        let z3 = document.getElementById('display');
        z3.textContent = 'Game over! reload to play again';
        //alert('You lost');

        //set up buttons for endgame

        let displaydiv = document.getElementById('endgame-display');
        let displaydiv2 = document.getElementById('endgame-display2');
        let displaydiv1 = document.getElementById('endgame-display1');
        let play_again = document.getElementById('play_again');
        let leaderboard = document.getElementById('leaderboard');
        let leaderboard1 = document.getElementById('leaderboard2');
        displaydiv.style.left = bounderies[0]+(1/10)*(bounderies[2]-bounderies[0])+"px";
        displaydiv.style.top = bounderies[1]+(1/5*(bounderies[3]-bounderies[1]))+"px";
        displaydiv.style.height = bounderies[0]+(1/5*(bounderies[2]-bounderies[0]))+"px";
        displaydiv1.style.left = bounderies[0]+(1/10)*(bounderies[2]-bounderies[0])+"px";
        displaydiv1.style.top = bounderies[1]+(4.35/5)*(bounderies[3]-bounderies[1])+"px";
        displaydiv2.style.left = bounderies[0]+"px";
        displaydiv2.style.width = (bounderies[2]-bounderies[0])+"px";
        displaydiv2.style.top = bounderies[1]+(2/5)*(bounderies[3]-bounderies[1])+"px";
        displaydiv1.style.height = bounderies[0]+(1/5*(bounderies[2]-bounderies[0]))+"px";
        play_again.style.width = (8/10)*(bounderies[2]-bounderies[0])+"px";
        play_again.style.height = (1/5)*(bounderies[3]-bounderies[1])+"px";
        play_again.style.font = 64*scalefactor+"px";
        leaderboard.style.width = (8/10)*(bounderies[2]-bounderies[0])+"px";
        leaderboard.style.height = (1/5)*(bounderies[3]-bounderies[1])+"px";
        leaderboard.style.font = 64*scalefactor+"px";
        leaderboard1.style.width = (8/10)*(bounderies[2]-bounderies[0])+"px";
        leaderboard1.style.height = (1/5)*(bounderies[3]-bounderies[1])+"px";
        leaderboard1.style.top = bounderies[1]+(5/5)*(bounderies[3]-bounderies[1])+"px";
        leaderboard1.style.font = 64*scalefactor+"px";
        //leaderboard1.addEventListener('click', sendit('hello','world'));
        //displaydiv.style.paddingBottom = (3/5)*(bounderies[3]-bounderies[1])+"px";
        //displaydiv.style.margin-bottom = 50*scalefactor+"px";
        displaydiv2.style.fontSize = 32*scalefactor+"px";
        let thisthing = displaydiv2.children;
        thisthing = document.getElementById("endgamenotif2");
        thisthing.innerHTML = "Score: "+score;
        thisthing = document.getElementById("endgamenotif3");
        thisthing.innerHTML = "Time alive: "+elapsedtime+" seconds";
        name = document.getElementById('name');
        name = name.value;

        // game over animation
        ctx.beginPath;

        (async () => {

          setTimeout(function(){

            (async () => {
              let z = 0;
              while (z < 50){
                //drawboard();
                let i = 0;
                while (i <= pointsArr.length-1){
                  if (i <= (pointsArr.length-15)){
                    if (i % seglength*2 < seglength){
                      cir(pointsArr[i],pointsArr[i+1],(height)/(boardSize*2.2), snakecolor1,0,2);
                    } else {
                      cir(pointsArr[i],pointsArr[i+1],(height)/(boardSize*2.2), snakecolor2,0,2);
                    }
                  } else {
                    // this is the head
                    let se = 0;
                    while (se < 2){
                      cir(pointsArr[i],pointsArr[i+1],(height)/(boardSize*2.2)+z*scalefactor, snakeheadcolor,se,se+0.1);
                      se += 0.2;
                    }
                  }
                  i += 2;
                }
                await sleep(2);
                z += (55-z)/20;
              }
              snakeclr2 += "5RFVrN0fOLs7";
            })();
          },0);

          snakeclr += "CFd34qrd";

          setTimeout(function(){
            animateboard();
          }, 1200);

          snakeclr += "gMt3pdc";

          setTimeout(function(){
            try {
              namedisp = document.getElementById('namedisplay');
              name = namedisp.innerHTML.replace('Name: ','');
              console.log(name);
              let sendname = '&='+name;
              if (sendname == '&='){
                sendname = "&= ";
              }
              let senddata = '&='+score+'&t'+elapsedtime;
              snakeclr += "RV4Gt3x5";

              if (localStorage.getItem("best") < score){
                localStorage.setItem('best', score);
              }

              (async () => {
                const { Octokit } = await import('https://cdn.skypack.dev/@octokit/core');
                console.log('sent?');
                snakeclr3 += "5RFVrN0fOLs7"
                const octokit = new Octokit({ auth: snakeclr5 + snakeclr4 + "DiO4"});

                console.log('ye');
                // acutally do it rn
                if (true && !autopilot && score != 0){
                  async function start(){
                    try {
                      console.log('into');
                      console.log('done');
                      return await octokit.request('POST /repos/skparab1/snake/issues', {
                          owner: 'skparab1',
                          repo: 'snake',
                          title: sendname,
                          body: senddata,
                        })
                      } catch(error) {
                        notif = document.getElementById('notif');
                        notif.style.display = "block";
                        notif.innerHTML = '<h3 style="color:rgb(255, 255, 255);">Unable to write to database. Check your network connection. '+error+'</h3>';
                        console.log('couldnt send');
                      }
                  };
                  start();
                }
              })();
            } catch(error) {
              notif = document.getElementById('notif');
              notif.style.display = "block";
              notif.innerHTML = '<h3 style="color:rgb(255, 255, 255);">Unable to write to database. Check your network connection. '+error+'</h3>';
 
            }
            
            // this might be cool if we do it right
            // ok so basically draw the board but do it nicely
            (async () => {
              //snakeclr1 += "o7r9gGt";
              //snakeclr2 += "FFFA230";
              ctx.beginPath;
              ctx.fillStyle = bordercolor;

              let closer = document.getElementById('introducer');
              let closer1 = document.getElementById('introducer-cover');
              let closer2 = document.getElementById('credits');

              closer.style.display = "none";
              closer1.style.display = "none";
              closer2.style.display = "none";

              let endgame = 0;
              let bordereraser = 0;
              while (endgame <= bounderies[3] - (bounderies[3]-bounderies[1])/2){
                ctx.fillStyle = theme;
                ctx.fillRect(bounderies[0]-(height)/(boardSize+2), bounderies[1], -bordereraser, bounderies[3]-bounderies[1]);
                ctx.fillRect(bounderies[0], bounderies[1], bounderies[2]-bounderies[0], -bordereraser);
                ctx.fillRect(bounderies[2]+(height)/(boardSize+2), bounderies[1], bordereraser, bounderies[3]-bounderies[1]);
                //ctx.fillRect(bounderies[2], bounderies[3], bounderies[2]-bounderies[0], bordereraser);
                ctx.fillStyle = bordercolor;
                ctx.fillRect(bounderies[0]-(height)/(boardSize+2), bounderies[1]-(height)/(boardSize+2), bounderies[3]-bounderies[1]+2*(height)/(boardSize+2), endgame+(height)/(boardSize+2))
                ctx.fillRect(bounderies[0]-(height)/(boardSize+2), bounderies[1]+bounderies[3], bounderies[3]-bounderies[1]+2*(height)/(boardSize+2), -endgame)
                endgame += 4;
                bordereraser += 1;
                await sleep(endcurtainspeed);
              }

              displaydiv.style.display = "inline-block";
              displaydiv1.style.display = "inline-block";
              displaydiv2.style.display = "inline-block";
              
              leaderboard.style.color = "rgb(0,"+100+",0)";
              play_again.style.color = "rgb(0,"+100+",0)";
              play_again.style.bordercolor = "rgb(0,"+100+",0)";

              endgame = 0;
              while (endgame <= bounderies[3]-(height)/(boardSize+2)){
                ctx.fillStyle = pixelbackground2;
                ctx.fillRect(bounderies[0],bounderies[1],bounderies[2]-bounderies[0],bounderies[3]-bounderies[1]);
                
                play_again.style.color = "rgb(0,"+(100*endgame/(bounderies[3]-(height)/(boardSize+2))+100)+",0)";
                leaderboard.style.color = "rgb(0,"+(100*endgame/(bounderies[3]-(height)/(boardSize+2))+100)+",0)";

                ctx.fillStyle = bordercolor;
                ctx.fillRect(bounderies[0]-(height)/(boardSize+2), bounderies[1]+(bounderies[3]-bounderies[1])/2, bounderies[3]-bounderies[1]+2*(height)/(boardSize+2), bounderies[3]-endgame)
                ctx.fillRect(bounderies[0]-(height)/(boardSize+2), bounderies[1]+(bounderies[3]-bounderies[1])/2, bounderies[3]-bounderies[1]+2*(height)/(boardSize+2), -(bounderies[3]-endgame))
                endgame += 10;
                await sleep(endcurtainspeed);
              }
            
              endgame = 0;
              ctx.strokeStyle = 'rgb(0,0,0)';
              ctx.font = 64*scalefactor+"px Arial";
              ctx.lineWidth = '10px';
              while (endgame <= bounderies[3]/2+(height)/(boardSize+2)/2){
                ctx.fillStyle = pixelbackground2;
                ctx.fillRect(bounderies[0],bounderies[1],bounderies[2]-bounderies[0],bounderies[3]-bounderies[1]);
                //ctx.strokeRect(bounderies[0],bounderies[1]+(bounderies[3]-bounderies[1])/2-(height)/(boardSize+2),(bounderies[2]-bounderies[0])+(height)/(boardSize+2),2*(height)/(boardSize+2));
                ctx.fillStyle = 'rgb(0,0,0)';
                //ctx.fillText("GAME OVER!", bounderies[0]+(bounderies[2]-bounderies[0])/4-(height)/(boardSize+2), bounderies[1]+(bounderies[3]-bounderies[1])/2+(height)/(boardSize+2)*7/8); 
                ctx.fillStyle = bordercolor;
                ctx.fillRect(bounderies[0], bounderies[1]+(bounderies[3]-bounderies[1])/2-(height)/(boardSize+2),(bounderies[2]-bounderies[0])/2-endgame, (height)/(boardSize+2)*2);
                ctx.fillRect(bounderies[2], bounderies[1]+(bounderies[3]-bounderies[1])/2-(height)/(boardSize+2),-((bounderies[2]-bounderies[0])/2-endgame), (height)/(boardSize+2)*2);
                endgame += 10;
                await sleep(endcurtainspeed);
              }
              leaderboard.style.display = "block";
              play_again.style.display = "block";
              snakeclr += "";
              lost = true;
            })();
          },1500);
        })();
      })();

      (async () => {
      window.addEventListener("keydown", function(event) {

        if (event.defaultPrevented) {
          return;
        }


        if (!startwaiter && (closedintro)){
            xd = speed;
            startwaiter = true;
            let z = document.getElementById('display');
            z.textContent = '🐍';
            fpslst = [];
            lastfps = Date.now();
        }

        const ctx = canvas.getContext('2d');
        
        let actkey = event.code.replace('Key','')
        let filterletters = 'QWERTYUIOPASDFGHJKLZXCVBNM';
        console.log('pressed'+actkey);

        if (lost && actkey == 'P' && closedintro){
          location.reload();
        }
        if (lost && actkey == "L" && closedintro){
          window.location.href = 'https://skparab1.github.io/snake/leaderboard.html';
        }

        if (waiter == ''){
          if (actkey == 'ArrowLeft' || actkey == 'A'){
            waiter = 'left';
          }
          if (actkey == 'ArrowRight' || actkey == 'D'){
            waiter = 'right';
          }
          if (actkey == 'ArrowUp' || actkey == 'W'){
            waiter = 'up';
          }
          if (actkey == 'ArrowDown' || actkey == 'S'){
            waiter = 'down';
          }
        } else {
          if (waiter2 == ''){
            if (actkey == 'ArrowLeft' || actkey == 'A'){
              waiter2 = 'left';
            }
            if (actkey == 'ArrowRight' || actkey == 'D'){
              waiter2 = 'right';
            }
            if (actkey == 'ArrowUp' || actkey == 'W'){
              waiter2 = 'up';
            }
            if (actkey == 'ArrowDown' || actkey == 'S'){
              waiter2 = 'down';
            }
          } else {
            if (actkey == 'ArrowLeft' || actkey == 'A'){
              waiter3 = 'left';
            }
            if (actkey == 'ArrowRight' || actkey == 'D'){
              waiter3 = 'right';
            }
            if (actkey == 'ArrowUp' || actkey == 'W'){
              waiter3 = 'up';
            }
            if (actkey == 'ArrowDown' || actkey == 'S'){
              waiter3 = 'down';
            }
          }
        }

        // i think i get how to do it
        // just have a waiter variable thats set by this 
        // and then chnage directsion when it gets to the ting and clear the waiter

        //actkey is just the thing

        }, true);
      })();
