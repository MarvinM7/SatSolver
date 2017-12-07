//exports.solve = function(fileName) {
	let formula = readFormula('tutorial.cnf')
	let result = doSolve(formula.clauses, formula.variables)
	console.log(result)
	return result 
//}

function readFormula(fileName) {
	fs = require('fs')
	let text = fs.readFileSync(fileName).toString() //leitura do arquivo 
	let clauses = readClauses(text)
	let variables = readVariables(clauses)
	let specOk = checkProblemSpecification(text, clauses, variables)
	let result = { 'clauses': [], 'variables': [] }
	if (specOk) {
		result.clauses = clauses
		result.variables = variables
	} else {
		console.log('Numero de variaveis dado na linha p incompatvel com o número de variaveis achado nas clausulas.')
	}
	
	return result
}

function readClauses(texto) {
	//remoçcao das linhas comentarios antes das clausulas
	texto = texto.split("\n")
	while (texto[0].charAt(0) == 'c' || texto[0].charAt(0) == 'p' || texto[0].charAt(0) == '') {
		texto.shift()
	}
	
	//ajustes 07/12
	for (i = 0; i < texto.length - 1; i++) {
		if (texto[i].charAt(texto[i].length - 1) != "0") {
			texto[i] = texto[i] + " " + texto[i + 1]
			for (n = i + 1; n < texto.length - 1; n++) {
				texto[n+1] = texto[n + 2]
			}
			texto.pop()	
		}	
	}
	
	//tirando o 0 das clausulas
	for (i = 0; i < texto.length; i++) {
		texto[i] = texto[i].replace(" 0", "")
	}

	//remove o ultimo elemento do vetor caso seja vazio ou comentario
	while (texto[texto.length - 1] == "" || texto[texto.length - 1].charAt(0) == 'c') {
		texto.pop()
	}
	
	//transforma as clausulas em arrays
	for (n = 0; n < texto.length; n++) {
		texto[n] = texto[n].split(" ")
	}
	
	return texto
}

function readVariables(clausulas) {
	//cria um array e distribui todas as variaveis de todas as clausulas nele
	i = 0
	let array = new Array()
	for (n = 0; n < clausulas.length; n++) {
		for (m = 0; m < clausulas[n].length; m++) {
			array[i] = clausulas[n][m]
			array[i] = array[i].replace("-", "")
			i++
		}
	}

	//ordena o array
	array = array.sort()
	
	//remove primeiro elemento do vetor caso seja vazio
	while (array[0] == '') {
		array.shift()
	}
	
	//remove ultimo elemento do vetor caso seja vazio
	while (array[array.length - 1] == '') {
		array.pop()
	}
	
	//conta quantos elementos diferentes possui
	j = 1
	for (m = 1; m < array.length; m++) {
		if (array[m] != array[m - 1]) {
			j++
		}
	}

	//cria o array variables e coloca seus elementos como 0
	novoarray = new Array(j)
	for (k = 0; k < novoarray.length; k++) {
		novoarray[k] = false
	}

	return novoarray
}

function checkProblemSpecification(texto, clausulas, variaveis) {
	texto = texto.split("\n")
	//elimina todas as linhas antes da linha p
	while (texto[0].charAt(0) != 'p') {
		texto.shift()
	}

	//elimina todas as linhas depois da linha p
	while (texto[texto.length - 1].charAt(0) != 'p') {
		texto.pop()
	}

	//isola os valores correspondentes as variaves e as clausulas
	texto[0] = texto[0].replace("p cnf ", "")
	nvariaveis = texto[0].split(" ")[0]
	nclausulas = texto[0].split(" ")[1]

	//compara os valores do tamanho do vetor com os valores da linha p
	if (nvariaveis == variaveis.length && nclausulas == clausulas.length) {
		booleano = true
	} else {
		booleano = false
	}

	return booleano
}

function doSolve(clauses, assignment) {
	teste = false
	let isSat = false
	i = 0
	while ((!isSat) && (i < Math.pow(2, assignment.length))) {
		//percorrer todas as clausulas
		for (m = 0; m < clauses.length; m++) {
			//percorrer todas as variaveis dentro de uma clausula
			for (n = 0; n < clauses[m].length; n++) {
				if ((clauses[m][n] < 0 && assignment[Math.abs(clauses[m][n]) - 1] == false) || (clauses[m][n] > 0 && assignment[Math.abs(clauses[m][n]) - 1] == true)) {
					teste = true
					break
				} else if ((clauses[m][n] > 0 && assignment[Math.abs(clauses[m][n]) - 1] == false) || (clauses[m][n] < 0 && assignment[Math.abs(clauses[m][n]) - 1] == true)) {
					teste = false
				}
			}
			if (teste == false) {
				i++
				assignment = nextAssignment(assignment)
				break
			}
		}
		if (teste == true) {
			isSat = true
		}

	}
	
	let result = {'isSat': isSat, satisfyingAssignment: null}
	if (isSat) {
		result.satisfyingAssignment = assignment
	}
	return result
}

function nextAssignment(currentAssignment) {
	//converte booleano para binario
	for (n = 0; n < currentAssignment.length; n++) {
		if (currentAssignment[n] == false) {
			currentAssignment[n] = 0
		} else {
			currentAssignment[n] = 1
		}
	}
	
	//gerador de combinacoes
	currentAssignment[currentAssignment.length - 1] = currentAssignment[currentAssignment.length - 1] + 1
	for (m = currentAssignment.length - 1; m > 0; m--) {
		if (currentAssignment[m] == 2) {
			currentAssignment[m] = 0
			currentAssignment[m - 1] = currentAssignment[m - 1] + 1
		}	
	}

	//cria o vetor booleano
	let newAssignment = new Array(currentAssignment.length)
	for (n = 0; n < newAssignment.length; n++) {
		if (currentAssignment[n] == 0) {
			newAssignment[n] = false
		} else {
			newAssignment[n] = true
		}
	}

	return newAssignment
}