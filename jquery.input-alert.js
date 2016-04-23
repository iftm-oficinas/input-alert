;(function ($) {

    //Code should be executed in strict mode.
    "use strict";

    //Create the defaults once.
    var pluginName = "inputAlert";
    var defaults = {
        validations: null
    };

    //Alert element.
    var dangerAlert = "<div class='alert alert-danger alert-dismissable' id='alert'><button aria-hidden='true' data-dismiss='alert' class='close' type='button'>×</button><i class='fa fa-times-circle'></i> <b>Verifique os erros no formulário</b><div style='border-top: 1px dashed #f2dede; color: #ebccd1; background-color: #ebccd1; height: 1px;  margin: 5px 0;'></div><div id='messages'></div></div>";

    //The actual plugin constructor.
    function Plugin(element, options) {
        this.element = element;
        this.settings = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
    }

    //Avoid Plugin.prototype conflicts.
    $.extend(Plugin.prototype, {
        validate: function (validations) {
            if (!validations) validations = this.settings.validations;
            if (validations.length == 0) throw "There is nothing to validate!";
            if ($.type(validations) != 'object') throw "The validations passed for validate must be an object!";

            //Remove old messages.
            $(this.element).children().remove();

            //Contains the messages for the alert.
            var messages = "";

            //Looking for all inputs.
            if (validations.inputs) {
                if ($.type(validations.inputs) != 'array') throw "The input passed for validate must be an array of objects!";
                $.each(validations.inputs, function (index, input) {
                    if ($.type(input) != 'object') throw "The input must be an object!";
                    if ((!input.reference) || (!input.rule) || (!input.message)) throw "The input object must contains reference, rule and message!";

                    //Define the search of the input, by name or id.
                    var elements = $(input.reference);

                    //Define the rule.
                    var rule = input.rule.split(':');
                    switch (rule[0]) {
                        case 'required':
                            switch (rule[1]) {
                                case 'check':

                                    //Validates the entry with rule required, using radios.
                                    var radioChecked = false;

                                    //Looking for all elements.
                                    $.each(elements, function (index, element) {
                                        if (element.checked) radioChecked = true;
                                    });

                                    if (!radioChecked) messages += input.message + "<br/>";
                                    break;

                                case 'select':

                                    //Validates the entry with rule required, using select
                                    var selected = true;

                                    //Looking for all elements.
                                    $.each(elements, function (index, element) {
                                        if (($(element).val() == 0) || ($(element).val() == "")) selected = false;
                                    });

                                    if (!selected) messages += input.message + "<br/>";
                                    break;

                                default:

                                    //Validates the entry with rule required.
                                    var valid = true;

                                    //Looking for all elements.
                                    $.each(elements, function (index, element) {
                                        if ($(element).val() == "") valid = false;
                                    });

                                    if (!valid) messages += input.message + "<br/>";
                            }
                            break;

                        case 'min':

                            //Validates the entry with rule min.
                            var hasMin = true;

                            //Looking for all elements.
                            $.each(elements, function (index, input) {
                                if ($(input).val() != "") {
                                    if ($(input).val() < rule[1] * 1) hasMin = false;
                                }
                            });

                            if (!hasMin) messages += input.message + "<br/>";
                            break;

                        default:
                            throw "Invalid rule!";
                    }
                });
            }

            //Loking for all validations.
            if (validations.scripts) {
                if ($.type(validations.scripts) != 'array') throw "The scripts passed for validate must be an array of objects!";
                $.each(validations.scripts, function (index, script) {
                    if ($.type(script) != 'object') throw "The script must be an object!";
                    if ((!script.script) || (!script.message)) throw "The script object must contains a script and message!";

                    if (!script.script()) {
                        messages += script.message + "<br/>";
                    }
                });
            }

            //Make the alert.
            if (messages != "") {
                $(this.element).prepend(dangerAlert);
                $(this.element).find('#messages').prepend(messages);
                if (Alert) Alert.toast(Alert.TOAST_ERROR, 'Verifique os erros no formulário');
                return false;
            }

            return true;
        },
        clear: function () {

            //Remove old messages.
            $(this.element).children().remove();
        }
    });

    //Preventing against multiple instantiations.
    $.fn[pluginName] = function (options) {
        this.each(function () {
            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" + pluginName, new Plugin(this, options));
            }
        });
        return $(this).data("plugin_" + pluginName);
    };

})(jQuery);