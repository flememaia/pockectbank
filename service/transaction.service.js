


// Fazer funções separadas para cada uma das ações:
// identificar o usuário (e o tipo PF ou PJ) com o id de rota 
// getTheUser
// verificar se o usuário pode fazer a transação em questão: PF pode enviar e receber. PJ pode apenas receber.
// isTransAllowed
// verificar se o saldo é suficiente para a transação em questão: value >= user.account.balance
// checkBalance 
// 
// função que chama as 3 funções acima para verificar se a transação é permitida.
// Se sim, envia o objeto resposta autorizando 
// get infortmation from (https://run.mocky.io/v3/8fafdd68-a090-496f-8c9a-3442cf30dae6)
// {
//     "message" : "Autorizado"
//   }
// se a resposta for "Autorizado" => cria a transação. 
// newTransaction 
// salva o id da transação no usuário
