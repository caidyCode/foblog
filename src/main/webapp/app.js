/**
 * Created by phn on 2016/2/2.
 */

var app = angular.module("webApp", [  "ngRoute",
		'ui.bootstrap', "ngSanitize", "ui.router", "ngFileUpload" ]);
app.config(function($httpProvider) {
    $httpProvider.interceptors.push('TokenInterceptor');
	$httpProvider.interceptors.push('HttpInterceptor');
});
app.filter("trusted", [ "$sce", function($sce) {
	return function(html) {
		if ((typeof html) == 'string') {
			// 判断类型为字符串
			return $sce.trustAsHtml(html);
		}
		return html;
	}
} ]);
app.config(function($routeProvider,$stateProvider) {
	  
	$routeProvider.when("/index", {
		templateUrl : "modules/index/index.view.html",
		controller : 'IndexController'
	}).when("/about", {
		templateUrl : "modules/about/about.view.html",
		controller : 'AboutController'
	}).when("/friendlink", {
		templateUrl : "modules/friendlink/friendlink.view.html",
		controller : 'FriendlinkController'
	}).when("/blog", {
		templateUrl : "modules/blog/article/article.view.html",
		controller : 'ArticleController'
	}).when("/blog/archive", {
		templateUrl : "modules/blog/archive/archive.list.view.html",
		controller : 'ArchiveListController'
	}).when("/blog/archive/:archiveName", {
		templateUrl : "modules/blog/archive/archive.article.view.html",
		controller : 'ArchiveArticleController'
	}).when("/blog/category", {
		templateUrl : "modules/blog/category/category.list.view.html",
		controller : 'CategoryListController'
	}).when("/blog/category/:categoryName", {
		templateUrl : "modules/blog/category/category.article.view.html",
		controller : 'CategoryArticleController'
	}).when("/blog/tag", {
		templateUrl : "modules/blog/tag/tag.list.view.html",
		controller : 'TagListController'
	}).when("/blog/tag/:tagName", {
		templateUrl : "modules/blog/tag/tag.article.view.html",
		controller : 'TagArticleController'
	}).when("/blog/article/:articleTitle", {
		templateUrl : "modules/blog/article/article.detail.view.html",
		controller : 'ArticleDetailController'
	});
	// 管理
	$routeProvider.when("/manage", {
        templateUrl : "modules/manage/manage.view.html",
        controller : 'ManageController'
    }).when("/manage/sign", {
        templateUrl : "modules/manage/sign/signin.manage.view.html",
        controller : 'SignManageController'
    }).when("/manage/info", {
		templateUrl : "modules/manage/info/info.manage.view.html",
		controller : 'InfoManageController',
        requiredLogin:  true
    }).when("/manage/info/edit", {
		templateUrl : "modules/manage/info/info.form.manage.view.html",
		controller : 'InfoFormManageController',
        requiredLogin:  true
    }).when("/manage/article", {
		templateUrl : "modules/manage/article/article.manage.view.html",
		controller : 'ArticleManageController',
        requiredLogin:  true
    }).when("/manage/article/new", {
		templateUrl : "modules/manage/article/article.form.manage.view.html",
		controller : 'ArticleFormManageController',
        requiredLogin:  true
    }).when("/manage/article/edit/:articleId", {
		templateUrl : "modules/manage/article/article.form.manage.view.html",
		controller : 'ArticleFormManageController',
        requiredLogin:  true
    }).when("/manage/article/preview/:articleId", {
		templateUrl : "modules/manage/article/article.detail.manage.view.html",
		controller : 'ArticleDetailManageController',
        requiredLogin:  true
    }).when("/manage/category", {
		templateUrl : "modules/manage/category/category.manage.view.html",
		controller : 'CategoryManageController',
        requiredLogin:  true
    }).when("/manage/tag", {
		templateUrl : "modules/manage/tag/tag.manage.view.html",
		controller : 'TagManageController',
        requiredLogin:  true
    }).when("/manage/info", {
		templateUrl : "modules/manage/info/info.manage.view.html",
		controller : 'InfoManageController',
        requiredLogin:  true
    }).when("/manage/friendlink", {
		templateUrl : "modules/manage/friendlink/friendlink.manage.view.html",
		controller : 'FriendlinkManageController',
        requiredLogin:  true
	});

	$routeProvider.otherwise({
		redirectTo : '/blog'
	});
});
app.run(function($rootScope, $location, $window) {
    $rootScope.$on("$routeChangeStart", function(event, nextRoute, currentRoute) {
        //redirect only if both isLogged is false and no token is set
        var t = sessionStorage.getItem("token");
        if (nextRoute != null && nextRoute.requiredLogin != null && nextRoute.requiredLogin
             && (t==undefined || t=="" || t=="null" || t==null)) {
            $location.path("/manage/sign");
        }
    });
});
app.factory('TokenInterceptor', function ($q, $window) {
    return {
        request: function (config) {
            config.headers = config.headers || {};
            if (sessionStorage.getItem("token")) {
                config.headers['X-Token'] =sessionStorage.getItem("token");
                //console.log(config)
            }
            return config;
        },

        response: function (response) {
            return response || $q.when(response);
        }
    };
});