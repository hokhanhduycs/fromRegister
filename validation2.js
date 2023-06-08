function Validator(formSelector){
    var _this = this
    function getParent(element, selector){
        while(element.parentElement){
            if(element.parentElement.matches(selector)){
                return element.parentElement
            }
            element = element.parentElement
        }
    }
    var formRules = {}
    // Quy ước tạo rule:
    // - Nếu có lỗi thì return 'error messages'
    // - Nếu không có lỗi thì return ''undefined
    var validatorRules =  {
        required: function (value){
            return value ? undefined : 'Vui lòng nhập trường này'
        },
        email: function (value){
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
            return regex.text(value) ? undefinded : 'Vui lòng nhập email'
        },
        min: function (min){
            return function (value){
                return value.length >= min ? undefined : `Vui lòng nhập ít nhất ${min} kí tự`
            }
        },
        max: function(max){
             return function (value){
                return value.length <= max ? undefined : `Vui lòng nhập tối đa ${max} kí tự`
             }
        }
    }

    var ruleName = 'required';



    //Lấy ra form element trong DOM theo `formSelector`
    var formElement = document.querySelector(formSelector)
    // console.log(formElement)
    //Chỉ xử lý khi có element trong DOM
    if (formElement){
        var inputs = formElement.querySelectorAll('[name][rules]')

        for(var input of inputs){
            var rules = input.getAttribute('rules').split('|')
            for (var rule of rules){
                var ruleInfo
                var isRuleHasValue = rule.includes(':')
                
                if(isRuleHasValue){
                    ruleInfo = rule.split(':')
                    rule = ruleInfo[0]
                }

                var ruleFnc = validatorRules[rule]

                if(isRuleHasValue){
                    rule  = ruleFnc(ruleInfo[1])
                }

                if (Array.isArray(formRules[input.name])){
                    formRules[input.name].push(ruleFnc);
                }else{
                    formRules[input.name] = ruleFnc
                }
            }
        
            // Lắng nghe sự kiện về validate (blur, change, ...)
            input.onBlur = handleValidate;
            input.oninput = handleClearError;
        }
        //Hàm thực hiện validate
        function handleValidate(event){
            var rules = formRules[event.target.name];
            var errorMessage;

            for (var rule of rules){
                errorMessage =  rule(event.target.value);
                if(errorMessage) break;
            }

            //Nếu có lỗi thì hiện thị message lỗi ra UI
            if (errorMessage){
                var formGroup = getParent(event.target, '.form-group') 
                if(formGroup){
                    formGroup.classList.add('invalid')
                    var formMessage = formGroup.querySelector('.form-message')
                    if(formMessage){
                        formMessage.innerText = errorMessage
                    }
                }
            }
        }
        // Hàm clear masseger lỗi
        function handleClearError(value){
            var formGroup = getParent(event.target, '.form-group')
            if(formGroup.classList.contains('invalid')){
                formGroup.classList.remove('invalid')

                var formMessage = formGroup.querySelector('.form-message')
                if(formMessage){
                    formMessage.innerText = ''
                }
            }
        }
    }
    // console.log(formRules)

    //Xử lý hành vi sumit form
    formElement.onsubmit = function(event){
        event.preventDefault();

        var input = formElement.querySelector('[name][rules]')
        var isValid  = true
        for(var input of input){
            if(!handleValidate({target: input})){
                isValid = false
            }
        }

        //Khi không có lỗi thì submit form
        if(isValid){
            if(typeof _this.onSubmit === 'function'){
                options.onSubmit();
            }else{
                formElement.submit();
            }
        }
    }

}