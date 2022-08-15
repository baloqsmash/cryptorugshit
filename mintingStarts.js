let countDownDate = new Date(1660696969000).getTime();

let x = setInterval(function() {
  let now = new Date().getTime();

  let distance = countDownDate - now;

  let days = Math.floor(distance / (1000 * 60 * 60 * 24));
  let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  let seconds = Math.floor((distance % (1000 * 60)) / 1000);

  document.getElementById("mintStart").innerHTML = "Minting in " + (days>0?(days + "d "):"") + (hours>0?(hours + "h "):"")
  + (minutes>0?(minutes + "m "):"") + seconds + "s ";

  if (distance < 0) {
    clearInterval(x);
    document.getElementById("mintStart").innerHTML = "MINTING NOW";
  }
}, 1000);