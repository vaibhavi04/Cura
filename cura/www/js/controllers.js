angular.module('starter.controllers', ['ngCordova'])

.controller('DashCtrl', function($scope, $ionicPlatform, $ionicModal, $cordovaVibration, $location, Forms) {
  $scope.alarmInterval = undefined;


  $scope.forms = Forms.all();
  $scope.currentForm = $scope.forms[0];

  console.log($scope.currentForm);


  // $ionicModal.fromTemplateUrl('contact-modal.html', {
  //   scope: $scope,
  //   animation: 'slide-in-up'
  // }).then(function(modal) {
  //   $scope.modal = modal
  // })  

  
  $ionicModal.fromTemplateUrl('templates/form-fill-modal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal
  }) 


  $scope.openModal = function() {
    $scope.modal.show()
  }

  $scope.closeModal = function() {
    $scope.modal.hide();
  };

  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });

  $scope.doAlarm = function(){
      $scope.alarmInterval = setInterval(function(){ 
        $cordovaVibration.vibrate(100) 
      }, 1000);

      $scope.openModal();
  }

  $scope.stopAlarm = function(){
    $scope.closeModal();
    clearInterval($scope.alarmInterval);
  }
})

.controller('CoachCtrl', function($scope, Resources) {


  $scope.resources = Resources.all();

  $scope.speech = { currentText: "", listening: false };
  $scope.recognition = new webkitSpeechRecognition();
  $scope.recognition.continuous = true;
  $scope.recognition.interimResults = true;


  $scope.recognition.onresult = function(event) {
    console.log(event.results[0][0].transcript);
    $scope.updateSpeech({ currentText: event.results[0][0].transcript })

    if ($scope.speech.currentText === "set up treatment"){
       console.log("UPDATING PATH");
       window.location = "#/tab/coach/1" ;
       $scope.recognition.stop();
       $scope.speech.currentText = "";
    }
  }





  $scope.speechButtonClicked = function(){
      if ($scope.speech.listening === true){
          $scope.recognition.stop();
          $scope.speech.listening = false;

      } else {
          $scope.speech.listening = true;
          $scope.recognition.start();
      }

  }

  $scope.updateSpeech = function(speechObj){

      console.log("Updating speech", speechObj)
      $scope.speech = angular.copy(speechObj);
      $scope.$apply();
      console.log($scope.speech);


  }






})

.controller('CoachDetailCtrl', function($scope, $stateParams, $ionicSlideBoxDelegate, Resources) {



  // Load and play videos on the resource detail controller 

  $scope.resource = Resources.get($stateParams.resourceId);
  console.log("LOGGING RESOURCE", $scope.resource);

  // Navigate through the stack of instructions

})


.controller('ChatsCtrl', function($scope, Chats) {
  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  }
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('SettingsCtrl', function($scope, $stateParams) {
  //$scope.chat = Chats.get($stateParams.chatId);
})

.controller('FriendsCtrl', function($scope, $cordovaContacts, Friends) {
  $scope.friends = Friends.all();
  $scope.addContact = function(){
    $cordovaContacts.pickContact().then(function (contact){
      alert(JSON.stringify(contact))      
      $scope.friends.push(contact);
    })
  }
})

.controller('FriendDetailCtrl', function($scope, $stateParams, Friends) {
  $scope.friend = Friends.get($stateParams.friendId);
})

.controller('MedicationsCtrl', function($scope, $stateParams, $ionicModal, $cordovaLocalNotification, Medications){
  $scope.medications = Medications.all();

  $ionicModal.fromTemplateUrl('templates/medication-add-modal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal
  })  

  $scope.newMedication = {};


  $scope.openModal = function() {
    $scope.modal.show()
  }

  $scope.closeModal = function() {
    $scope.modal.hide();
  };

  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });

  $scope.update = function(newMedication) {

    var newId = $scope.medications.length;
    var newMed = angular.copy(newMedication);
    newMed.id = newId;
    $scope.medications.push(newMed);
    $scope.closeModal()

    console.log($scope.medications)

    var alarmTime = new Date();
    alarmTime.setSeconds(alarmTime.getSeconds() + 10);
    Medications.sync($scope.medications);
    console.log(Medications.all())
  };

  $scope.reset = function() {
    $scope.user = angular.copy({});
  };




})

.controller('MedicationDetailCtrl', function($scope, $stateParams, Medications) {

  $scope.medication = {};
  console.log("DETAIL CTRL");
  $scope.medication = Medications.get($stateParams.medicationId);
  console.log(Medications.all())
})

.controller('HomeCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };

});

