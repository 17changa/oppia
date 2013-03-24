// Copyright 2012 Google Inc. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview Directives for Oppia.
 *
 * @author sll@google.com (Sean Lip)
 */

oppia.directive('list', function (warningsData) {
  return {
    restrict: 'E',
    scope: {items: '=', largeInput: '@'},
    templateUrl: '/templates/list',
    controller: function ($scope, $http, $attrs) {

      $scope.activeItem = null;

      $scope.openItemEditor = function(index) {
        $scope.activeItem = index;
      };

      $scope.closeItemEditor = function() {
        $scope.activeItem = null;
      };

      $scope.addItem = function(newItem) {
        if (!newItem) {
          warningsData.addWarning('Please enter a non-empty item.');
          return;
        }
        $scope.newItem = '';
        $scope.items.push(newItem);
      };

      $scope.replaceItem = function(index, newItem) {
        if (!newItem) {
          warningsData.addWarning('Please enter a non-empty item.');
          return;
        }
        $scope.index = '';
        $scope.replacementItem = '';
        if (index < $scope.items.length && index >= 0) {
          $scope.items[index] = newItem;
        }
        $scope.closeItemEditor();
      };

      $scope.deleteItem = function(index) {
        $scope.deleteIndex = '';
        $scope.items.splice(index, 1);
      };
    }
  };
});

// An editable string directive.
oppia.directive('string', function (warningsData) {
  return {
    restrict: 'E',
    scope: {item: '='},
    templateUrl: '/templates/string',
    controller: function ($scope, $http, $attrs) {

      $scope.active = false;

      $scope.openItemEditor = function() {
        $scope.active = true;
      };

      $scope.closeItemEditor = function() {
        $scope.active = false;
      };

      $scope.replaceItem = function(newItem) {
        if (!newItem) {
          warningsData.addWarning('Please enter a non-empty item.');
          return;
        }
        $scope.replacementItem = '';
        $scope.item = newItem;
        $scope.closeItemEditor();
      };
    }
  };
});

oppia.directive('mustBeValidString', function($timeout) {
  return {
    require: 'ngModel',
    link: function(scope, elm, attrs, ctrl) {
      ctrl.$parsers.unshift(function(viewValue) {
        if (scope.isValidEntityName(viewValue, false)) {
          // it is valid
          ctrl.$setValidity('invalidChar', true);
          return viewValue;
        } else {
          // it is invalid, return the old model value
          elm[0].value = ctrl.$modelValue;
          ctrl.$setValidity('invalidChar', false);
          $timeout(function() {
            ctrl.$setValidity('invalidChar', true);
          }, 2000);
          return ctrl.$modelValue;
        }
      });
    }
  };
});

oppia.directive('angularHtmlBind', function($compile) {
  return function(scope, elm, attrs) {
    scope.$watch(attrs.angularHtmlBind, function(newValue, oldValue) {
      if (newValue !== oldValue) {
        elm.html(newValue);
        $compile(elm.contents())(scope);
      }
    });
  };
});

oppia.directive('imageUpload', function($exceptionHandler) {
  return {
    compile: function(tplElm, tplAttr) {
      return function(scope, elm, attr) {
        var input = angular.element(elm[0]);

        // evaluate the expression when file changed (user selects a file)
        input.bind('change', function() {
          try {
            scope.$eval(attr.openFiles, {$files: input[0].files});
            scope.setActiveImage(input[0].files[0]);
          } catch (e) {
            $exceptionHandler(e);
          }
        });
      };
    }
  };
});

// File upload for gallery page.
oppia.directive('fileUpload', function($exceptionHandler) {
  return {
    compile: function(tplElm, tplAttr) {
      return function(scope, elm, attr) {
        var input = angular.element(elm[0]);

        // evaluate the expression when file changed (user selects a file)
        input.bind('change', function() {
          try {
            scope.$eval(attr.openFiles, {$files: input[0].files});
            scope.$parent.setActiveFile(input[0].files[0]);
          } catch (e) {
            $exceptionHandler(e);
          }
        });
      };
    }
  };
});

// override the default input to update on blur
oppia.directive('ngModelOnblur', function() {
  return {
    restrict: 'A',
    require: 'ngModel',
    link: function(scope, elm, attr, ngModelCtrl) {
      if (attr.type === 'radio' || attr.type === 'checkbox') return;
        elm.unbind('input').unbind('keydown').unbind('change');
        elm.bind('blur', function() {
          scope.$apply(function() {
          ngModelCtrl.$setViewValue(elm.val());
        });
      });
    }
  };
});
