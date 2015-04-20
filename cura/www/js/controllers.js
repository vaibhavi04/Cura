angular.module('starter.controllers', ['ngCordova','nvd3'])

.controller('DashCtrl', function($scope, $ionicPlatform, $ionicModal, $cordovaVibration) {
  $scope.alarmInterval = undefined;

  $ionicModal.fromTemplateUrl('contact-modal.html', {
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

.controller('ChatsCtrl', function($scope, Chats) {
  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  }
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
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

.controller('VisualCtrl', function($scope, $stateParams, Visuals) {
  $scope.visuals = [{values:Visuals.all(), key:'Test Wave', color: '#ff7f0e'}];
  $scope.vOption = {
            chart: {
                type: 'lineChart',
                height: 450,
                margin : {
                    top: 20,
                    right: 20,
                    bottom: 40,
                    left: 55
                },
                x: function(d){ return d.x; },
                y: function(d){ return d.y; },
                useInteractiveGuideline: true,
                dispatch: {
                    stateChange: function(e){ console.log("stateChange"); },
                    changeState: function(e){ console.log("changeState"); },
                    tooltipShow: function(e){ console.log("tooltipShow"); },
                    tooltipHide: function(e){ console.log("tooltipHide"); }
                },
                xAxis: {
                    axisLabel: 'Time (ms)'
                },
                yAxis: {
                    axisLabel: 'Voltage (v)',
                    tickFormat: function(d){
                        return d3.format('.02f')(d);
                    },
                    axisLabelDistance: 30
                },
                callback: function(chart){
                    console.log("!!! lineChart callback !!!");
                }
            },
            title: {
                enable: true,
                text: 'Line Chart Sample 1'
            },
            subtitle: {
                enable: true,
                text: 'Subtitle for simple line chart. Lorem ipsum dolor sit amet, at eam blandit sadipscing, vim adhuc sanctus disputando ex, cu usu affert alienum urbanitas.',
                css: {
                    'text-align': 'center',
                    'margin': '10px 13px 0px 7px'
                }
            },
            caption: {
                enable: true,
                html: '<b>Figure 1.</b> Lorem ipsum dolor sit amet, at eam blandit sadipscing, <span style="text-decoration: underline;">vim adhuc sanctus disputando ex</span>, cu usu affert alienum urbanitas. <i>Cum in purto erat, mea ne nominavi persecuti reformidans.</i> Docendi blandit abhorreant ea has, minim tantas alterum pro eu. <span style="color: darkred;">Exerci graeci ad vix, elit tacimates ea duo</span>. Id mel eruditi fuisset. Stet vidit patrioque in pro, eum ex veri verterem abhorreant, id unum oportere intellegam nec<sup>',
                css: {
                    'text-align': 'justify',
                    'margin': '10px 13px 0px 7px'
                }
            }
        };
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
    alarmTime.setSeconds(alarmTime.getSeconds() + 15);
    Medications.sync($scope.medications);
    console.log(Medications.all())
    // $cordovaLocalNotification.add({
    //     id: "1234",
    //     date: alarmTime,
    //     message: "This is a message",
    //     title: "This is a title",
    //     autoCancel: true,
    //     sound: null
    // }).then(function () {
    //     alert("The notification has been set");
    // });




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

.controller('HomeCtrl', function($scope, $http, $timeout) {
  var url = "http://128.2.83.208:8006/api/v1/homeautomation/ha_user/";
  // init
  $http.get(url).success(function(data){
    //update settings with data
  });

  $scope.settings = {
    tvSwitch: true,
    isHeating: true,
    temprature: 70,
    mode: function(){
      return $scope.settings.isHeating ? "Heating" : "Cooling";
    }
  };

  // TV Swtich, 1155B6
  $scope.$watch('settings.tvSwitch', function() {
    console.log('TV changed:' + $scope.settings.tvSwitch);
    $http.put(url, JSON.stringify({
      user_name: "ha_user",
      tag_id: "1155B6",
      signal_type: "swtich",
      current_value: 0,
      required_value: $scope.settings.tvSwitch ? 0 : 1
    }))
  });

  //temprature
  var timeoutId = null;
  $scope.$watch('settings.temprature', function() {
    //console.log('Has changed');
        if(timeoutId !== null) {
            //console.log('Ignoring this movement');
            return;
        }
        //console.log('Not going to ignore this one');
        timeoutId = $timeout( function() {
            console.log('It changed recently!');
            $timeout.cancel(timeoutId);
            timeoutId = null;
            // Now load data from server, check url and params
            url = "/api/v1/home_automation";
            data = {
              user_name: 'ha_user',
              tag_id: '111',
              current_value: 0,
              required_value: 1
          }
            //$http.put(url, JSON.stringify(data));
        }, 1000); 
  });
});
