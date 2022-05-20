(async () => {
  const data1 = await fetch("./data.json").then(r => r.json());

  var datanames = data1.data[0];
  var datascores = data1.data[1];
  
  datanames = JSON.stringify(datanames);
  datascores = JSON.stringify(datascores);
  
  datanames = datanames.replace('{"name":"','');
  datanames = datanames.replace('"}','');
  datascores = datascores.replace('{"scores":"','');
  datascores = datascores.replace('"}','');


  while (datanames.includes('+')){
    datanames = datanames.replace('+',' ');
  }
  while (datascores.includes('+')){
    datascores = datascores.replace('+',' ');
  }

  var names = datanames.split('&=');
  var scores = datascores.split('&=');

  names = ['Shubham','skparab1','poisonfy'];
  scores = ['&=8&t36.997','&=7&t18.458','&=2&t38.261'];
  let points = [];
  let times = [];
  let i = 0;
  while (i < scores.length){
    points.push(scores[i].split('&t')[0].replace('&=',''));
    times.push(scores[i].split('&t')[1]);
    i += 1;
  }

  // now we need to order it properly
  var rankscores = [];
  i = 0;
  while (i < names.length){
    rankscores.push(parseFloat(points[i])+parseFloat(times[i])/10);
    i += 1;
  }

  var ranks = [];
  var subjlist = [];
  i = 0;
  while (i < rankscores.length){
    subjlist.push(rankscores[i]);
    i += 1;
  }

  let ranker = 1;
  console.log(subjlist);
  while (subjlist.length > 0){
    let max = (subjlist.reduce(function(a, b) {
      return Math.max(a, b);
  }, -Infinity));

    console.log('max '+max);
    console.log('index '+rankscores.indexOf(max));
    console.log('lst '+subjlist);
    ranks.push(rankscores.indexOf(max));
    subjlist.splice(subjlist.indexOf(max),1);

    // add the div

    i = rankscores.indexOf(max);

    let display = document.getElementById('leaderboard generated');
    display.innerHTML += `
    <div class="fullwidth">
    <div class="left-container">
      <h1>`+ranker+`</h1>
    </div>
    <div class="right-container">
      <h1>`+names[i]+`</h1>
    </div>
    <div class="mid-container">
      <h1>`+points[i]+`</h1>
    </div>
    <div class="mid-container">
      <h1>`+times[i]+`</h1>
    </div>
    <div class="center-container">
      <h1>`+rankscores[i]+`</h1>
    </div>
  </div>
  <br>`;
  ranker += 1;
  }

  console.log(rankscores);
  console.log(ranks);

  // i = 0;
  // while (i < names.length){
  //   let display = document.getElementById('leaderboard generated');
  //   display.innerHTML += `
  //   <div class="fullwidth">
  //   <div class="left-container">
  //     <h1>Rank</h1>
  //   </div>
  //   <div class="right-container">
  //     <h1>`+names[i]+`</h1>
  //   </div>
  //   <div class="mid-container">
  //     <h1>`+points[i]+`</h1>
  //   </div>
  //   <div class="mid-container">
  //     <h1>`+times[i]+`</h1>
  //   </div>
  //   <div class="center-container">
  //     <h1>`+rankscores[i]+`</h1>
  //   </div>
  // </div>
  // <br>`;
  //   i += 1;
  // }

})();
