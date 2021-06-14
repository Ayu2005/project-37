//Create variables here
var dog, happyDog;
var dogImage, happyDogImage;
var database;
var foodS, foodStock;
var fedTime,lastFed;
var feed,addFood;
var foodObj;
var gameState,readState;
var bedroom,garden,washroom;


function preload()
{
	//load images here
  dogImage=loadImage("images/dogImg.png");
  happyDogImage=loadImage("images/dogImg1.png");
  bedroom=loadImage("images/bedroom.png");
  garden=loadImage("images/Garden.png");
  washroom=loadImage("images/washroom.png");

}

function setup() {
  database = firebase.database();

	createCanvas(900, 600);

  foodObj = new Food();

  dog=createSprite(800,200,150,150);
  dog.addImage(dogImage);
  dog.scale=0.3;

  foodStock=database.ref('Food');
  foodStock.on("value",readStock);

  feed=createButton("Feed the dog");
  feed.position(700,430);
  feed.mousePressed(feedDog);

  addFood=createButton("Add Food");
  addFood.position(800,430);
  addFood.mousePressed(addFoods);

  fedTime=database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed=data.val();
  });

  readState=database.ref('gameState');
  readState.on("value",function(data){
    gameState=data.val();
  });

 
  
}


function draw() {  
  background(46,139,87);

  currentTime=hour();
  if(currentTime==(lastFed)){
    update("Happy");
    foodObj.feeded();
    feed.hide();
    addFood.hide();
  }
  if(currentTime==(lastFed+1)){
      update("Playing");
      foodObj.garden();
   }else if(currentTime==(lastFed+2)){
    update("Sleeping");
      foodObj.bedroom();
   }else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4)){
    update("Bathing");
      foodObj.washroom();
   }else{
    update("Hungry")
    foodObj.display();
   }

  if(gameState!="Hungry"){
    feed.hide();
    addFood.hide();
    dog.remove();
  }else{
   feed.show();
   addFood.show();
   dog.addImage( dogImage);
  }



  

  fill("blue");
  textSize(15);
  if(lastFed>=12){
    text("Last Feed : "+ lastFed%12 + " PM", 350,30);
   }else if(lastFed==0){
     text("Last Feed : 12 AM",350,30);
   }else{
     text("Last Feed : "+ lastFed + " AM", 350,30);
   }

  


  drawSprites();
  //add styles here
  
}

function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}

function feedDog(){

  dog.addImage(happyDogImage);
  

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour(),
    gameState:"Hungry"
  })
}

function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}

function update(state){
  database.ref('/').update({
    gameState:state
  })
}

