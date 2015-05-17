angular.module('opal.controllers').controller(
    'CDRCtrl', function($scope, $rootScope, $http,
                        profile,
                        growl,
                        formulations){
        
        $scope.profile = profile;
        $scope.formulations = formulations;
        $scope._drug_names_to_id = {}
        $scope.drug_list = _.map(formulations, function(f){
            var name = f.drug + ' ' + f.amount + ' ' + f.units;
            $scope._drug_names_to_id[name] = f.id
            return name
        });

        console.log($scope.formulations)
        console.log($scope.drug_list)
        
        $scope.initial_state = function(){
            $scope.state = 'Initial';
            $scope.booking = {datetime: new Date()};
            $scope.patient = {};
            $scope.ward = { datetime: new Date() };
        };
        $scope.initial_state();
        
        $scope.set_state = function(what){ $scope.state = what };

        $scope.save_booking = function(){
            $scope.set_state('Initial');
            growl.info('Booked in delivery!')
            $scope.booking = {}
        };

        $scope.save_patient = function(){
            $scope.set_state('Initial');
            growl.info('Supplied to Patient')
            $scope.patient = {};
        }

        $scope.save_ward = function(){
            var data = {
                amount: $scope.ward.quantity,
                supplied_individual: $scope.ward.collector,
                ward: $scope.ward.ward_name,
                datetime: moment($scope.ward.datetime).format(),
                formulation: $scope._drug_names_to_id[$scope.ward.product]
            }
            $http.post('/api/supplied_from_pharmacist/', data).then(
                function(){
                    $scope.set_state('Initial');
                    growl.info('Supplied to ward');
                    $scope.ward = {};
                }, 
                function(data){
                    console.log(data);
                    alert(data);
                });
        }
        
        $scope.back_to_initial = function(){
            $scope.initial_state()
        }
    }
);
