# input-alert
Um plugin jQuery que ajuda com a validação no client-side.

# Métodos
- **validate()** - Aplica as regras de validação de acordo com os parâmetros recebidos(Seu parâmetro deve ser um objeto com pelo menos um dos campos: inputs ou scripts).
- **clean()** - Limpa qualquer mensagem da tela.

# Inputs
inputs é um array de objetos que deve ser declarado como um campo no objeto passado. Todos os inputs possuem 3 campos obrigatórios: **reference**, **rule** e **message**.

- **reference** - String que deve obedecer o formato de um seletor jquery. EX: "#elemento", ".elemento", "[name='elemento']", etc.
- **rule** - String que deve obedecer o formato de "required:check", onde o valor que vem antes dos dois pontos é o tipo de regra e o segundo é o tipo de validação utilizada. O segundo valor é o opcional.
- **message** - String com a mensagem que aparecerá caso a validação retorne false.

As seguintes regras podem ser passadas pelo campo rule do input adicionado:

- **required** - O elemento deve possuir um value diferente de vazio.
- **required:check** - O elemento deve retornar true para a função .checked.
- **required:select** - O elemento deve possuir um value diferente de vazio ou 0.
- **min:0** - O elemento deve possuir um value maior que o informado depois dos dois pontos.

Obs: Ao utilizar vários elementos, as regras acima serão aplicadas a todos, para se resultar uma mensagem de erro nenhum elemento pode retornar true(exceto o select, onde pelo menos um deve ser true).

# Scripts
Scripts é um array de objetos que deve ser declarado como um campo no objeto passado. Todos os scripts possuem 2 campos obrigatórios: **script** e **message**.

- **script** - Esse campo deve receber uma função, que retorne verdadeiro ou falso.
- **message** - String com a mensagem que aparecerá caso a validação retorno false.

# Guia passo a passo

1. No HTML você deve criar um elemento DIV que inicializará o plugin.

```html
<!-- É nesse elemento que seu alerta aparecerá -->
<div id="alertCamposObrigatorios"></div>
```

2. No javascript você deve inicializar o inputAlert a partir desse elemento DIV:

3. Sempre que for aplicar a validação, basta chamar a função validate(), passando os parâmetros;

```javascript
    var alertCamposObrigatorios = $('#alertCamposObrigatorios');
    var inputAlert = alertCamposObrigatorios.inputAlert();

    var result = inputAlert.validate({
        inputs: [
            {
                reference: '#requiredText',
                rule: 'required',
                message: 'The field TextField is required!'
            },
            {
                reference: '#requiredMinNumber',
                rule: 'required',
                message: 'The field RequiredNumberField is required!'
            },
            {
                reference: '#requiredMinNumber',
                rule: 'min:0',
                message: 'The field RequiredNumberField must be greater than 0!'
            },
            {
                reference: '[name="radios"]',
                rule: 'required:check',
                message: 'The field Radios is required!'
            }
        ],
        scripts: [
            {
                script: function () {
                    //Alguma lógica...

                    return true;//ou false
                },
                message: 'Validation by script!'
            }
        ]
    });

    //result receberá true ou false.
```

# Outras Utilizações

Você pode inicializar o inputAlert já passando todos os parâmetros e chamar a função validade():

```javascript
var alertCamposObrigatorios = $('#alertCamposObrigatorios');

//Inicializa com todos os parâmetros.
var inputAlert = alert.inputAlert({
    inputs: [
        {
            reference: '#requiredText',
            rule: 'required',
            message: 'The field TextField is required!'
        },
        {
            reference: '#minNumber',
            rule: 'min:0',
            message: 'The field NumberField must be greater than 0!'
        },
        {
            reference: '#requiredMinNumber',
            rule: 'min:0',
            message: 'The field RequiredNumberField must be greater than 0!'
        }
    ]
});

//Chamar o método vazio, utiliza os inputs padrões definidos na inicialização.
inputAlert.validate();
```

Você pode alterar as validations a qualquer momento:

```javascript
var alertCamposObrigatorios = $('#alertCamposObrigatorios');
var inputAlert = alertCamposObrigatorios.inputAlert();

//Substitui todos as validations padrões por essas:
inputAlert.settings.validations = {
    inputs: [
        {
            reference: '#requiredText',
            rule: 'required',
            message: 'The field TextField is required!'
        }
    ],
    scripts: [
        {
            script: function () {
                return true;
            },
            message: 'Validation by script!'
        }
    ]
}

inputAlert.validate();
```

Você pode remover o alerta a qualquer momento:

```javascript
//Remove o alerta.
inputAlert.clear();
```