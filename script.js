var dadosConsultores = {};
var dadosConsultoresGeral = {};
var dadosProfissoes = {};
var dadosFormaConsultoria = {};
var dadosMunicipios = {};
var dadosIdiomas = {};
var dadosLegenda = {};
var dadosAtendimento = {};
var mymap;

$(document).ready(function() { 
	carregarConsultores();
	inicializarMapa();
	carregarMarcadores();
	carregarTabela();
	carregarFiltro();
	
	//Legenda
	html = '';
	for(var k in dadosLegenda) {
		markerHtmlStyles = "background-color: "+dadosLegenda[k]+";"+
				"width: 2rem;"+
				"height: 2rem;"+
				"left: -1.5rem;"+
				"top: -1.5rem;"+
				"border-radius: 3rem 3rem 0;"+
				"transform: rotate(45deg);"+
				"border: 1px solid #FFFFFF";
		
		html += '<span style="white-space:nowrap;"><label style="'+markerHtmlStyles+'"/>'
		html += "" + k + "</span>&nbsp;&nbsp;";
	}
	$("#div_legenda").html(html);
	
	$('#busca_livre').keypress(function (e) {
		var key = e.which;
		if(key == 13) {  // the enter key code
			filtrar();
			return false;  
		}
	}); 
});

function carregarConsultores(){
	//Carregar Consultores
	$.ajax({
		url: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSZH782wcxkKaPMbUJIjYkZCRlxGIeL-IPs4FKoocTppC_FKzKnBfc6RB6y_OJRG9GolckCG3RqcgnJ/pubhtml?gid=545001420&single=true',
		data: 'tipo=listarConsultores',
		type: 'POST',
		async: false,
		success: function(data){
			//dadosConsultores = JSON.parse(data);
			dados = JSON.parse(data);
			dadosConsultores = dados['consultores'];
			dadosConsultoresGeral = dados['consultores'];
			dadosProfissoes = dados['profissoes'];
			dadosFormaConsultoria = dados['forma_consultoria'];
			dadosMunicipios = dados['municipios'];
			dadosIdiomas = dados['idiomas'];
			dadosLegenda = dados['legenda'];
			dadosAtendimento = dados['atendimento'];
			
			console.log(dadosConsultores[0]);
		}
	});
}

function inicializarMapa(){
	//Carregar Mapa
	mymap = L.map('mapid'/*,{dragging: !L.Browser.mobile}*/).setView([51.505, -0.09], 6);
	L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoicmV2aXJhc2F1ZGUiLCJhIjoiY2thaDY3cjl1MGdoYzJ4cWhteHg3NzNleiJ9.uAR_3bDLrVH4rQ-O10vdMQ', {
		maxZoom: 18,
		attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
			'<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
			'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
		id: 'mapbox/streets-v11',
		tileSize: 512,
		zoomOffset: -1
	}).addTo(mymap);
}

function carregarMarcadores(){
	var arrayOfMarkers = [];
	$(".leaflet-marker-icon").remove(); $(".leaflet-popup").remove();
	for (let i = 0; i < dadosConsultores.length; i++) {
		if (dadosConsultores[i].latitude == null) continue;
		
		// Configure/customize these variables.
		var showChar = 50;  // How many characters are shown by default
		var ellipsestext = "...";
		var moretext = "Mostrar Mais >";
		var lesstext = "Mostrar Menos";
		
		cons = dadosConsultores[i];
		profissao = cons.profissao;
		if(cons.profissao_especificacao != '') profissao += ' -> ' + cons.profissao_especificacao;
		registro_profissional = cons.registro_profissional + cons.registro_profissional_graduado;
		idioma = cons.idioma;
		if(cons.idioma_especificacao != '') idioma += ' -> ' + cons.idioma_especificacao;
		
		var formacao_experiencia_ocupacao = cons.formacao_experiencia_ocupacao;
		if(formacao_experiencia_ocupacao.length > showChar) {
			var c = formacao_experiencia_ocupacao.substr(0, showChar);
			var h = formacao_experiencia_ocupacao.substr(showChar, formacao_experiencia_ocupacao.length - showChar);
			var html = c + '<span class="moreellipses">' + ellipsestext+ '&nbsp;</span><span class="morecontent"><span>' + h + '</span>&nbsp;&nbsp;<a href="" class="morelink">' + moretext + '</a></span>';
			formacao_experiencia_ocupacao = html;
		}
		var disponibilidade_consultoria = cons.disponibilidade_consultoria;
		if(disponibilidade_consultoria.length > showChar) {
			var c = disponibilidade_consultoria.substr(0, showChar);
			var h = disponibilidade_consultoria.substr(showChar, disponibilidade_consultoria.length - showChar);
			var html = c + '<span class="moreellipses">' + ellipsestext+ '&nbsp;</span><span class="morecontent"><span>' + h + '</span>&nbsp;&nbsp;<a href="" class="morelink">' + moretext + '</a></span>';
			disponibilidade_consultoria = html;
		}
		var forma_consultoria = cons.forma_consultoria;
		if(forma_consultoria.length > showChar) {
			var c = forma_consultoria.substr(0, showChar);
			var h = forma_consultoria.substr(showChar, forma_consultoria.length - showChar);
			var html = c + '<span class="moreellipses">' + ellipsestext+ '&nbsp;</span><span class="morecontent"><span>' + h + '</span>&nbsp;&nbsp;<a href="" class="morelink">' + moretext + '</a></span>';
			forma_consultoria = html;
		}
		
		texto_marcador = '<b>Nome: </b></span>'+cons.nome_completo+'<br />';
		texto_marcador += '<b>Endereço: </b>'+cons.endereco_completo+'<br />';
		texto_marcador += '<b>Profissão: </b>'+profissao+'<br />';
		texto_marcador += '<b>Formações, experiências e ocupação: </b><span class="more">'+formacao_experiencia_ocupacao+'</span><br />';
		texto_marcador += '<b>Disponibilidade para teleconsultoria: </b><span class="more">'+disponibilidade_consultoria+'</span><br />';
		texto_marcador += '<b>Forma de teleconsultoria: </b><span class="more">'+forma_consultoria+'</span><br />';
		//Contatos
		texto_marcador += '<b>Contatos: </b>';
		if(cons.telefone_fixo != '') texto_marcador += '<i>Telefone Fixo</i>: '+cons.telefone_fixo+'<br />';
		if(cons.celular != '') texto_marcador += '<i>Celular</i>: '+cons.celular+'<br />';
		if(cons.whatsapp != '') texto_marcador += '<i>Whatsapp</i>: '+cons.whatsapp+'<br />';
		if(cons.email != '') texto_marcador += '<i>E-mail</i>: '+cons.email+'<br />';
		if(cons.skype != '') texto_marcador += '<i>Skype</i>: '+cons.skype+'<br />';
		if(cons.facebook != '') texto_marcador += '<i>Facebook</i>: '+cons.facebook+'<br />';
		if(cons.instagram != '') texto_marcador += '<i>Instagram</i>: '+cons.instagram+'<br />';
		if(cons.outros_contatos != '') texto_marcador += '<i>Outros</i>: '+cons.outros_contatos+'<br />';
		//Fecha contatos
		texto_marcador += '<b>Horários de Preferência</b>: '+cons.horarios_preferencia+'<br />';
		texto_marcador += '<b>Idiomas</b>: '+idioma;
	
		markerHtmlStyles = "background-color: "+cons.marker_color+";"+
							   "width: 3rem;"+
							   "height: 3rem;"+
							   "display: block;"+
							   "left: -1.5rem;"+
							   "top: -1.5rem;"+
							   "position: relative;"+
							   "border-radius: 3rem 3rem 0;"+
							   "transform: rotate(45deg);"+
							   "border: 1px solid #FFFFFF";
		
		icon_custom = L.divIcon({
		  iconAnchor: [0, 24],
		  labelAnchor: [-6, 0],
		  popupAnchor: [0, -36],
		  html: '<span style="'+markerHtmlStyles+'" />'
		})
		
		L.marker([dadosConsultores[i].latitude, dadosConsultores[i].longitude], {icon: icon_custom})
			  .addTo(mymap)
			  .bindPopup(texto_marcador, {
				//maxWidth: "auto"
				maxWidth: 200
			  }).on('click', function() { 	
				$(".morelink").click(function(){
					if($(this).hasClass("less")) {
						$(this).removeClass("less");
						$(this).html(moretext);
					} else {
						$(this).addClass("less");
						$(this).html(lesstext);
					}
					$(this).parent().prev().toggle();
					$(this).prev().toggle();
					return false;
				});
			});
		
		arrayOfMarkers.push([dadosConsultores[i].latitude, dadosConsultores[i].longitude])
	}
	
	if(arrayOfMarkers.length != 0) {
		bounds = new L.LatLngBounds(arrayOfMarkers);
		mymap.fitBounds(bounds);	
	} else {
		$(".leaflet-marker-icon").remove(); $(".leaflet-popup").remove();
	}
}

function carregarTabela(){
	$("#tbody_lista_consultores").html('');
	for (let i = 0; i < dadosConsultores.length; i++) {
		background = '#EAEDED';
		if(i % 2 === 0) background = '#D7DBDD';
		//style =""
		cons = dadosConsultores[i];
		profissao = cons.profissao;
		if(cons.profissao_especificacao != '') profissao += ' -> ' + cons.profissao_especificacao;
		registro_profissional = cons.registro_profissional + cons.registro_profissional_graduado;
		idioma = cons.idioma;
		if(cons.idioma_especificacao != '') idioma += ' -> ' + cons.idioma_especificacao;
		newRowContent = '<tr style="background-color: '+background+';"><th>Nome</th>';
		newRowContent += '<td style="word-break:break-word;">'+cons.nome_completo+'</td></tr>';
		newRowContent += '<tr style="background-color: '+background+';"><th>Profissão</th><td style="word-break:break-word;">'+profissao+'</td></tr>';
		//newRowContent += '<tr style="background-color: '+background+';"><th>Registro Profissional</th><td style="word-break:break-word;">'+registro_profissional+'</td></tr>';
		newRowContent += '<tr style="background-color: '+background+';"><th>Endereço</th><td style="word-break:break-word;">'+cons.endereco_completo+'</td></tr>';
		newRowContent += '<tr style="background-color: '+background+';"><th>Formações, experiências e ocupação atual</th><td style="word-break:break-word;">'+cons.formacao_experiencia_ocupacao+'</td></tr>';
		newRowContent += '<tr style="background-color: '+background+';"><th>Disponibilidade para teleconsultoria</th><td style="word-break:break-word;">'+cons.disponibilidade_consultoria+'</td></tr>';
		newRowContent += '<tr style="background-color: '+background+';"><th>Forma de teleconsultoria</th><td style="word-break:break-word;">'+cons.forma_consultoria+'</td></tr>';
		//contatos
		newRowContent += '<tr style="background-color: '+background+';"><th>Contatos</th><td style="word-break:break-word;">';
		if(cons.telefone_fixo != '') newRowContent += '<i>Telefone Fixo</i>: '+cons.telefone_fixo+'<br/>';
		if(cons.celular != '') newRowContent += '<i>Celular</i>: '+cons.celular+'<br/>';
		if(cons.whatsapp != '') newRowContent += '<i>Whatsapp</i>: '+cons.whatsapp+'<br/>';
		if(cons.email != '') newRowContent += '<i>E-mail</i>: '+cons.email+'<br/>';
		if(cons.skype != '') newRowContent += '<i>Skype</i>: '+cons.skype+'<br/>';
		if(cons.facebook != '') newRowContent += '<i>Facebook</i>: '+cons.facebook+'<br/>';
		if(cons.instagram != '') newRowContent += '<i>Instagram</i>: '+cons.instagram+'<br/>';
		if(cons.outros_contatos != '') newRowContent += '<i>Outros</i>: '+cons.outros_contatos;
		newRowContent += '</td></tr>';
		//fecha contatos
		newRowContent += '<tr style="background-color: '+background+';"><th>Horários de Preferência</th><td style="word-break:break-word;">'+cons.horarios_preferencia+'</td></tr>';
		newRowContent += '<tr style="background-color: '+background+';"><th>Idiomas</th><td style="word-break:break-word;">'+idioma+'</td></tr>';
		$("#tbody_lista_consultores").append(newRowContent);
	}
}

function carregarFiltro(){
	html = '';
	for (let i = 0; i < dadosProfissoes.length; i++) html += '<option value="'+dadosProfissoes[i]+'">'+dadosProfissoes[i]+'</option>'
	$("#profissao").append(html);	
	
	html = '';
	for (let i = 0; i < dadosMunicipios.length; i++) html += '<option value="'+dadosMunicipios[i]+'">'+dadosMunicipios[i]+'</option>'
	$("#municipio").append(html);
	
	html = '';
	for (let i = 0; i < dadosFormaConsultoria.length; i++) html += '<option value="'+dadosFormaConsultoria[i]+'">'+dadosFormaConsultoria[i]+'</option>'
	$("#forma_consultoria").append(html);
	
	html = '';
	for (let i = 0; i < dadosIdiomas.length; i++) html += '<option value="'+dadosIdiomas[i]+'">'+dadosIdiomas[i]+'</option>'
	$("#idioma").append(html);
	
	html = '';
	for (let i = 0; i < dadosAtendimento.length; i++) html += '<option value="'+dadosAtendimento[i]+'">'+dadosAtendimento[i]+'</option>'
	$("#atendimento").append(html);
}

function filtrar(){
	dadosConsultores = dadosConsultoresGeral;
	contatos_log = '';
	if($("#telefone_fixo").is(':checked')) { dadosConsultores = dadosConsultores.filter((obj) => obj.telefone_fixo != ''); contatos_log += 'telefone fixo - ';}
	if($("#celular").is(':checked')) { dadosConsultores = dadosConsultores.filter((obj) => obj.celular != ''); contatos_log += 'celular - ';}
	if($("#email").is(':checked')) { dadosConsultores = dadosConsultores.filter((obj) => obj.email != ''); contatos_log += 'email - ';}
	if($("#whatsapp").is(':checked')) { dadosConsultores = dadosConsultores.filter((obj) => obj.whatsapp != ''); contatos_log += 'whatsapp - ';}
	if($("#skype").is(':checked')) { dadosConsultores = dadosConsultores.filter((obj) => obj.skype != ''); contatos_log += 'skype - ';}
	if($("#outros_contatos").is(':checked')) { dadosConsultores = dadosConsultores.filter((obj) => obj.outros_contatos != ''); contatos_log += 'outros - ';}
	contatos_log = contatos_log.substring(0,contatos_log.length-3);
	
	profissao_log = '';
	if ( $("#profissao").val() != "-1" ) {
		dadosConsultores = dadosConsultores.filter((obj) => obj.profissao == $("#profissao").val());
		profissao_log = $("#profissao").val();
	}
	forma_consultoria_log = '';
	if ( $("#forma_consultoria").val() != "-1" ) {
		dadosConsultores = dadosConsultores.filter((obj) => obj.forma_consultoria.indexOf($("#forma_consultoria").val()) !== -1);
		if ( $("#forma_consultoria").val().indexOf('Síncrona') !== -1 ) forma_consultoria_log = 'S';
		else forma_consultoria_log = 'A';
	}
	idioma_log = '';
	if ( $("#idioma").val() != "-1" ) {
		dadosConsultores = dadosConsultores.filter((obj) => obj.idioma.indexOf($("#idioma").val()) !== -1);
		idioma_log = $("#idioma").val();
	}
	atendimento_log = '';
	if ( $("#atendimento").val() != "-1" ) {
		dadosConsultores = dadosConsultores.filter((obj) => obj.atendimento == $("#atendimento").val());
		atendimento_log = $("#atendimento").val();
	}
	municipio_log = '';
	if ( $("#municipio").val() != "-1" ) {
		estado = $("#municipio").val().substring(
												 $("#municipio").val().lastIndexOf("(") + 1, 
												 $("#municipio").val().lastIndexOf(")"));
		dadosConsultores = dadosConsultores.filter((obj) => obj.estado == estado);
		
		municipio = $("#municipio").val().substring(
													0, 
													$("#municipio").val().lastIndexOf(" ("));
		dadosConsultores = dadosConsultores.filter((obj) => obj.municipio == municipio);						   
		municipio_log = $("#municipio").val();
	}
	
	if ( $("#busca_livre").val() != "" ) {
		//Tirar acentos e outros caracteres especiais
		busca_livre = $("#busca_livre").val().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
		
		dadosConsultores = dadosConsultores.filter((obj) => 
			obj.profissao.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").indexOf(busca_livre) !== -1 ||
			obj.profissao_especificacao.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").indexOf(busca_livre) !== -1 ||
			obj.formacao_experiencia_ocupacao.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").indexOf(busca_livre) !== -1 ||
			obj.disponibilidade_consultoria.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").indexOf(busca_livre) !== -1
		);
	}
	
	carregarMarcadores();
	carregarTabela();
	
	//Gerar Log
	log = '&contatos='+contatos_log+'&profissao='+profissao_log+'&forma_consultoria='+forma_consultoria_log;
	log += '&idioma='+idioma_log+'&municipio='+municipio_log+'&busca_livre='+$("#busca_livre").val();
	log += '&atendimento='+atendimento_log;
	$.ajax({
		url: './ajax.php',
		data: 'tipo=gravarLog'+log,
		type: 'POST'
	});
}
