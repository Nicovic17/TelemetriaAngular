

function myBattery(lvl)
{
    let battery=document.getElementById("battery");

    if(lvl<=100 && lvl>75)
    {
        battery.innerHTML = "&#xf240";
    }
    else
    if(lvl<=75 && lvl >50)
    {
        battery.innerHTML = "&#xf241";
    }
    else
    if(lvl<=50 && lvl >25)
    {
        battery.innerHTML = "&#xf242";
    }
    else
    if(lvl<=25 && lvl>0)
    {
        battery.innerHTML = "&#xf243";
    }
    else
    if(lvl==0)
    {
        battery.innerHTML = "&#xf244";
    }

    /*setTimeout(function(){
        lvl=lvl-25;
        myBattery(lvl);
    },1000);*/
    
}