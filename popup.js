/**
 * Created by Sunil on 26/05/17.
 */

var App = {
    URL_browsers_list: "https://www.browserstack.com/list-of-browsers-and-platforms.json?product=live",
    URL_integration_api: "https://www.browserstack.com/start#",
    query_params: {}
};
(function (App) {
    function init() {
        $(document).ready(function () {
            $.get(App.URL_browsers_list, function (data) {
                App.browser_data = data;
                load_platforms(App.browser_data)
            });

            $("#platform_dropdown").change(function () {
                $("#OS_dropdown option.os").remove();
                $("#browser_dropdown option.browser").remove();
                load_os($("#platform_dropdown").val());
                App.platform = $("#platform_dropdown").val();
            });

            $("#OS_dropdown").change(function () {
                $("#browser_dropdown option.browser").remove();
                if ($("#platform_dropdown").val() == "mobile") {
                    load_devices($("#platform_dropdown").val(), $("#OS_dropdown").val());
                }
                else {
                    load_browsers($("#platform_dropdown").val(), $("#OS_dropdown").val())
                }
                App.query_params.os = App.browser_data[App.platform][$("#OS_dropdown").val()].os;
                App.query_params.os_version = App.browser_data[App.platform][$("#OS_dropdown").val()].os_version;
            });

            $("#browser_dropdown").change(function () {
                [App.query_params.browser, App.query_params.browser_version] =  $("#browser_dropdown").val().split(" ");
            });
            
            $("#launch_test").click(function () {
                test_url($("#web_link").val());
            })
        });
    }

    function load_platforms() {
        $.each(Object.keys(App.browser_data), function (index, value) {
            $("#platform_dropdown").append(get_option(value, value, "platform"))
        })
    }
    
    function load_os(platform) {
        $.each(App.browser_data[platform], function (index, value) {
            $("#OS_dropdown").append(get_option(value.os_display_name, index, "os"))
        })
    }

    function load_browsers(platform, os_index) {
        $.each(App.browser_data[platform][os_index].browsers, function (index, value) {
            $("#browser_dropdown").append(get_option(value.display_name, value.display_name, "browser"))
        })
    }

    function load_devices(platform, os_index) {
        $.each(App.browser_data[platform][os_index].devices, function (index, value) {
            $("#browser_dropdown").append(get_option(value.device, value.device, "browser"))
        })
    }

    function get_option(text, value, class_name) {
        var option = new Option(text, value);
        option.className = class_name;
        return option
    }
    function test_url(testingURL) {
        var defaultParams = {
            scale_to_fit: true,
            resolution: '1024x768',
            speed: 1,
            start: true,
            url: testingURL || 'www.google.com'
        };
        App.url_to_launch = App.URL_integration_api + $.param(App.query_params) + "&" + $.param(defaultParams);
        chrome.tabs.create({url: App.url_to_launch, selected: true});
    }
    init();
})(App);
