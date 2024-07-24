const desktopInstructions = document.getElementById('desktopInstructions');
const mobileInstructions = document.getElementById('mobileInstructions');
const title = document.getElementById('title');
const canvas = document.getElementById('myCanvas');
const counter = document.getElementById('counter');
const description = document.getElementById('description');
const Aname = document.getElementById('name');
const pCanvas = document.getElementById('pCanvas')

const screenWidth = screen.width;

if(screenWidth<500) {
    title.style.top='3vh';
    title.style.fontSize='2vh';
    counter.style.top='3vh';
    counter.style.fontSize='2vh';
    desktopInstructions.style.display='none';
    mobileInstructions.style.display='block';
    mobileInstructions.style.top='7vh';
    mobileInstructions.style.fontSize='1vh';
    canvas.style.top='10vh';
    description.style.top = '80vh';
    description.style.left='15vw';
    description.style.fontSize = '1vh';
    
    Aname.style.left='15vw';
    Aname.style.top = '83vh';

    pCanvas.style.display='none';
}
else{
    title.style.padding='none';
    title.style.top='0vh';
    counter.style.top='1vh';
    desktopInstructions.style.display='block';
    desktopInstructions.style.fontSize='2vh';
    desktopInstructions.style.top='10vh';
    mobileInstructions.style.display='none';
    
    canvas.style.top='17vh';
    pCanvas.style.top='17vh';
    description.style.top = '90vh';
    description.style.left='15vw';
    description.style.fontSize='2vh';
    
    
    Aname.style.right='15vw';
    Aname.style.top = '90vh';
}

let counterVal =0;


const ctx = canvas.getContext('2d');

const width = canvas.width = window.innerWidth*2;
const height = canvas.height = window.innerHeight*2;

console.log(screen.width)

console.log("a")

class vector{
    constructor(x,y){
        this.x=x;
        this.y=y;
    }
}

class point{
    constructor(x,y){
        this.x=x;
        this.y=y;
        this.xgrow = Math.random();
        this.ygrow = Math.random();
    }
    mirror(o){
        const x = o.x+(o.x-this.x);
        const y = o.y+(o.y-this.y);

        return new point(x,y);
    }
    oToD(){

    }
}

class path{
    constructor(origin,destination,length,bend=100,color='black',lineWidth=3){
        this.bend = bend;
        this.origin=origin;
        this.destination = destination;
        this.length=length;
        this.points=[this.origin,this.origin];
        this.color=color;
        this.lineWidth=lineWidth;
        
        
    }
    build(){
        this.points=[this.origin,this.origin];
        for(let i=0;i<this.length;i++){
            const newPoint = new point(this.origin.x+Math.random()*(this.destination.x-this.origin.x),this.origin.y+Math.random()*(this.destination.y-this.origin.y));
            const anchor1 = new point(newPoint.x+Math.random()*this.bend,newPoint.y+Math.random()*this.bend);
            const anchor2 = anchor1.mirror(newPoint);

            this.points.push(anchor1);
            
            this.points.push(newPoint);
            this.points.push(anchor2);
        }

        const anchor1 = new point(this.destination.x+Math.random()*this.bend,this.destination.y+Math.random()*this.bend);
        const anchor2 = anchor1.mirror(this.destination);
        this.points.push(anchor1);
        this.points.push(this.destination);
        this.points.push(anchor2);

    }
    animate(val,index,depth){
        if(index==1){
            this.points.forEach((p)=>{
            p.x=p.x+p.xgrow*val;
            p.y=p.y+p.ygrow*val;
            })
        }
        else if(index==1){
            this.bend=this.bend+depth*val;
        }
        else if(index==2){
            this.lineWidth=this.lineWidth+depth*val*0.1;
        }
        
    }
    draw(){
       /* this.points.forEach((p)=>{
            ctx.beginPath();
            ctx.fillStyle = 'blue';
            ctx.arc(p.x,p.y,this.lineWidth,0,Math.PI*2);
            ctx.fill()

        })*/
       //ctx.moveTo(this.origin.x,this.origin.y);
       ctx.lineWidth=this.lineWidth;
       ctx.strokeStyle=this.color;;
       for(let i=0;i<this.length+1;i++){
            const pIndex = i*3;
            ctx.beginPath();
            ctx.moveTo(this.points[pIndex].x,this.points[pIndex].y);
            ctx.bezierCurveTo(this.points[pIndex+1].x, this.points[pIndex+1].y, this.points[pIndex+2].x, this.points[pIndex+2].y, this.points[pIndex+3].x, this.points[pIndex+3].y);
            ctx.stroke();
       }



    }

}

class grid{
    constructor( origin,width,height,division,showSquares=false,fillSquare=false,squareWidth=10,squarecolor='red',pathWidth=3,pathcolor='black',pathBend=100,margin=0,chaos=0,squareOversize=0,animationSpeed,animationDepth,isAnimated=false){
        this.origin=origin;
        this.width=width;
        this.height = height;
        this.division=division;
        this.Xspacing=Math.floor(this.width/this.division);
        this.Yspacing=Math.floor(this.height/this.division);
        this.paths=[];
        this.pathBend=pathBend;
        this.showSquares=showSquares;
        this.squareWidth=squareWidth;
        this.pathWidth=pathWidth;
        this.pathcolor=pathcolor;
        this.squarecolor=squarecolor;
        this.margin=margin;
        this.chaos=chaos;
        this.squareOversize=squareOversize;
        this.fillSquare=fillSquare;
        this.animationSpeed=animationSpeed;
        this.animationDepth=animationDepth*width*0.001
        this.isAnimated=isAnimated
        this.animationIndex;
        if(isAnimated) this.animationIndex=Math.floor(Math.random()*4);
        else this.animationIndex=0;

    }
    build(){
        for(let i=0;i<this.division;i++){
            for(let j=0;j<this.division;j++){
                const origin = new point(this.origin.x+j*this.Xspacing+(0+this.chaos*Math.random())*this.Xspacing,this.origin.y+i*this.Yspacing+(0+this.chaos*Math.random())*this.Yspacing);
                const destination = new point((this.origin.x+j*this.Xspacing+(1-this.chaos*Math.random())*this.Xspacing)-this.margin*this.Yspacing,(this.origin.y+i*this.Yspacing+(1-this.chaos*Math.random())*this.Yspacing)-this.margin*this.Yspacing);
                const myPath = new path(origin,destination,3,this.pathBend);
                

                this.paths.push(myPath);

            }
        }
        this.paths.forEach((p)=>{
            
            if(this.showSquares){
                ctx.lineWidth=this.squareWidth;
                ctx.strokeStyle=this.squarecolor;
                ctx.fillStyle=this.squarecolor;
                const width = p.destination.x-p.origin.x;
                const height = p.destination.y-p.origin.y;
                if(this.fillSquare) ctx.fillRect(p.origin.x-this.squareOversize,p.origin.y-this.squareOversize,width+this.squareOversize*2,height+this.squareOversize*2);
                else ctx.strokeRect(p.origin.x-this.squareOversize,p.origin.y-this.squareOversize,width+this.squareOversize*2,height+this.squareOversize*2);
            }
            p.build();
            p.lineWidth=this.pathWidth;
            p.color=this.pathcolor;
            
            
        })
    }
    animateGrid(val){
        if(this.isAnimated){
            if(this.animationIndex<3){
                this.paths.forEach((p)=>{
                p.animate(Math.sin(val*this.animationSpeed)*this.animationDepth,this.animationIndex,this.animationDepth)
                })
            }
            else if(this.animationIndex==3){
                this.squareOversize=this.squareOversize+this.squareOversize*this.animationDepth*Math.sin(val*this.animationSpeed)*0.01;
            }
        

        }
    }
    draw(){
        
        this.paths.forEach((p)=>{
            if(this.showSquares){
                ctx.lineWidth=this.squareWidth;
                ctx.strokeStyle=this.squarecolor;
                ctx.fillStyle=this.squarecolor;
                const width = p.destination.x-p.origin.x;
                const height = p.destination.y-p.origin.y;
                if(this.fillSquare) ctx.fillRect(p.origin.x-this.squareOversize,p.origin.y-this.squareOversize,width+this.squareOversize*2,height+this.squareOversize*2);
                else ctx.strokeRect(p.origin.x-this.squareOversize,p.origin.y-this.squareOversize,width+this.squareOversize*2,height+this.squareOversize*2);
            }

        })
        this.paths.forEach((p)=>{
            p.draw();
            
        })
    }
}

let grids = [];

let color = Math.floor(360*Math.random());

let descriptionTXT;

function generate(){
    const numGrids = Math.floor(10+Math.random()*100);
    for(let n=0;n<numGrids;n++){

        const Gorigin = new point(Math.random()*width,Math.random()*height);
        const maxWidth = width-Gorigin.x;
        const maxHeight = height -Gorigin.y;
        const Gwidth = (Math.random()*maxWidth)-100;
        const Gheight = (Math.random()*maxHeight)-100;
        let divisions;
        if(Math.random()>0.5) divisions=Math.floor(Math.random()*width*0.01);
        else divisions=Math.floor(Math.random()*height*0.01);
        let showSquares;
        let squareWidth;
        let squarecolor;
        let pathWidth = Gwidth*0.001+Math.random()*Gwidth*0.01;
        let pathcolor = 'hsla('+Math.floor(Math.random()*10)*150+color+','+(50+(Math.random()*50))+'%,'+(50+(Math.random()*50))+'%,'+(0.5+Math.random())+')';
        let margin = Math.random()
        let chaos = Math.random()
        let fillSquare;
        let squareOversize = Math.random()*Gwidth*0.1;
        let pathBend = Math.exp(Math.random()*2);
        let animationSpeed = Math.floor(Math.random()*4)+1;
        let animationDepth = 0.3+Math.random()*2;
        let isAnimated;
        if(Math.random()>0.5) isAnimated=true;
        else isAnimated=false;
        if(Math.random()>0.85) {
            showSquares=true;
            squareWidth=Math.random()*0.01*Gwidth;
            squarecolor='hsla('+Math.floor(Math.random()*10)*150+color+','+(50+(Math.random()*50))+'%,'+(20+(Math.random()*60))+'%,'+(Math.random())+')';
            if(Math.random()>0.8) {
                fillSquare=true;
                squarecolor='hsla('+Math.floor(Math.random()*10)*150+color+','+(50+(Math.random()*50))+'%,'+(20+(Math.random()*60))+'%,'+(Math.random())+')';
            }
        }
        console.log(squarecolor)

       
        

        const newGrid = new grid(Gorigin,Gwidth,Gheight,divisions,showSquares,fillSquare,squareWidth,squarecolor,pathWidth,pathcolor,pathBend,margin,chaos,squareOversize,animationSpeed,animationDepth,isAnimated);
        grids.push(newGrid);
        newGrid.build();

        newGrid.draw();
        console.log(newGrid);
        
        descriptionTXT = 'Number of grids : '+numGrids+'  Base color : '+color+'  Dimensions : '+width+' x '+height;

    }
    counterVal++
    counter.innerHTML='#'+counterVal;
    description.innerHTML=descriptionTXT;

}


let frame = 0;
generate()

let bgColor = 'hsla('+Math.floor(Math.random()*10)*150+color+',60%,70%,1)';
let isRunning = false;

function main(){
    ctx.fillStyle=bgColor;
    ctx.fillRect(0,0,width,height);

    grids.forEach((g)=>{
        g.animateGrid(frame*0.01);
        g.draw();
    })

    if(isRunning){
        frame++
        requestAnimationFrame(main);
    }

}

main()

function onkeydown(e){
    console.log(e.code)
    if(e.code=='KeyN'){
        
        grids = [];
        color = Math.floor(360*Math.random());
        frame=0;
        generate()
        bgColor = 'hsla('+color+300+',70%,50%,1)';
        isRunning=false;
        main()
    }
    else if(e.code=='Space'){
            if(isRunning)isRunning=false;
            else isRunning=true;
            console.log(isRunning)
            main();
    }
    else if(e.code=='Enter'){


        
        const link = document.createElement('a');
        link.download = '#'+counterVal+'.png';
        link.href = canvas.toDataURL()
        
        if(askForCode())link.click();
        // Simulate a click on the link to prompt download
        

        console.log('Instance saved to file.');
    }


}



document.addEventListener('keydown',onkeydown)
//canvas.style.filter = 'contrast(1)'

canvas.addEventListener("touchstart", ()=>{
    grids = [];
        color = Math.floor(360*Math.random());
        frame=0;
        generate()
        bgColor = 'hsla('+color+300+',70%,50%,1)';
        isRunning=false;
        main()
});

function askForCode() {
    let isAuthorised=false;
    // Prompt the user to enter some text
    let userInput = prompt("Code:");
    
    // Check if the user provided input or cancelled the prompt
    if (userInput == 2147) {
        isAuthorised=true;
    } else {
        alert("Download not authorized.");
    }
    return isAuthorised
}
