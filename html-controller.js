
      function left(){
        waiter = 'left';
      }
      function up(){
        waiter = 'up';
      }
      function down(){
        waiter = 'down';
      }
      function right(){
        waiter = 'right';
      }
      function togglemusic(){
        if (audioElement.paused){
          audioElement.play();
          let audiobtn = document.getElementById("audiobtn");
          audiobtn.textContent = "Pause Music";
        } else {
          audioElement.pause();
          let audiobtn = document.getElementById("audiobtn");
          audiobtn.textContent = "Play Music";
        }
      }
      function maketheme(id,clr){
        let ab = document.getElementById(id);
        ab.style.color = clr;
      }
      function clrbtn(id,clr){
        let ab = document.getElementById(id);
        ab.style.backgroundColor = clr;
        ab.style.borderColor = clr;
      }
      function clrbtn1(id,clr){
        let ab = document.getElementById(id);
        ab.style.borderColor = clr;
      }
      function toggleautopilot(){
        if (autopilot){
          localStorage.setItem('autopilot',"false");
          location.reload();
        } else {
          localStorage.setItem('autopilot',"true");
          location.reload();
        }
      }
      function toggletheme(){
        if (theme == "black" || theme == "rgb(0,0,0)"){
          (async () => {
            let a = 0;
            while (a <= 255){
              document.body.style.backgroundColor = 'rgb('+a+','+a+','+a+')';
              theme = 'rgb('+a+','+a+','+a+')';
              let setclr = 'rgb('+(255-a)+','+(255-a)+','+(255-a)+')';
              maketheme('score',setclr);
              maketheme('best',setclr);
              maketheme('time',setclr);
              maketheme('display',setclr);
              maketheme('ap notif',setclr);
              maketheme('namedisplay',setclr);
              maketheme('header',setclr);
              maketheme('header1',setclr);
              maketheme('header2',setclr);
              maketheme('header3',setclr);
              maketheme('gc',setclr);
              maketheme('themedisp',setclr);
              maketheme('settings',setclr);
              clrbtn('playbtn1',theme);
              clrbtn('playbtn2',setclr);
              clrbtn('playbtn3',theme);
              clrbtn('playbtn4',setclr);
              clrbtn('playbtn5',setclr);
              clrbtn('playbtn6',setclr);
              
              a += 3;
              await sleep(2);
            }
          })();
          let aa = document.getElementById('themedisp');
          aa.innerHTML = "Theme: Light"
        } else {
          (async () => {
            let a = 255;
            while (a >= 0){
              document.body.style.backgroundColor = 'rgb('+a+','+a+','+a+')';
              theme = 'rgb('+a+','+a+','+a+')';
              let setclr = 'rgb('+(255-a)+','+(255-a)+','+(255-a)+')';
              maketheme('score',setclr);
              maketheme('best',setclr);
              maketheme('time',setclr);
              maketheme('display',setclr);
              maketheme('ap notif',setclr);
              maketheme('namedisplay',setclr);
              maketheme('header',setclr);
              maketheme('header1',setclr);
              maketheme('header2',setclr);
              maketheme('header3',setclr);
              maketheme('gc',setclr);
              maketheme('themedisp',setclr);
              maketheme('settings',setclr);
              clrbtn('playbtn1',theme);
              clrbtn1('playbtn2',setclr);
              clrbtn('playbtn3',theme);
              clrbtn1('playbtn4',setclr);
              clrbtn1('playbtn5',setclr);
              clrbtn1('playbtn6',setclr);
              a -= 3;
              await sleep(2);
            }
          })();
          let aa = document.getElementById('themedisp');
          aa.innerHTML = "Theme: Dark"
        }
      }