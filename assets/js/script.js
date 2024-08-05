$(document).ready(function () {
  $("button[type='button']").on("click", function () {
    // validación de ingreso numérico
    const regex = /^\d+$/;
    // obtención del valor ingresado por el usuario
    let input = $("#inputheroe").val();
    // condición de validación
    if (regex.test(input) && input > 0 && input <= 733) {
      $("form").on("submit", usuarios(input));
    } else {
      alert("No se puede buscar Heroe, intenta con un número");
    }
  });
});
/*la función setea los valores de configuración junto con el número del Super hero para buscar el resultado a la Api, retornando la información del héroe que se verá reflejada en la carta y el grafico.
 */

const usuarios = function (id) {
  // configuración de parámetros para la Api
  const settings = {
    async: true,
    crossDomain: true,
    url: `https://www.superheroapi.com/api.php/4905856019427443/${id}`,
    method: "GET",
    dataType: "json",
    headers: {
      Accept: "*/*",
    },
  };

  $.ajax(settings)
    // respuesta positiva
    .done(function (response) {
      // se setean los parámetros hacia el HTML en este caso utilizando ID
      $("#heroeimg").attr("src", response.image.url);
      $("#nombrehero").text("Nombre: " + response.name);
      $("#conexioneshero").text(
        "Conexiones: " + response.connections["group-affiliation"]
      );
      $("#publisherhero").text(
        "Publicado por: " + response.biography.publisher
      );
      $("#ocupacionhero").text("Ocupación: " + response.work.occupation);
      $("#primeraaparicionhero").text(
        "Primera Aparición: " + response.biography["first-appearance"]
      );
      $("#alturahero").text(
        "Altura: " + response.appearance.height.join(" - ")
      );
      $("#pesohero").text("Peso: " + response.appearance.weight.join(" - "));
      $("#alianzashero").text(
        "Alianzas: " + response.biography.aliases.join(" ")
      );
      // ciclo for para mostrar los "stats" en el gráfico, junto con la condición de no considerar los "stats null"
      const chartData = [];
      for (const power in response.powerstats) {
        if (response.powerstats[power] !== "null") {
          chartData.push({
            y: Number(response.powerstats[power]),
            label: power,
          });
        } else {
          continue;
        }
      }
      // se le asigna el ID HeroChart para mostrar el grafico en el HTML
      $("#heroChart").CanvasJSChart({
        title: {
          animationEnabled: true,
          text: `Estadísticas de Poder para ${response.name}`,
          fontSize: 28,
        },
        data: [
          {
            type: "pie",
            startAngle: 25,
            toolTipContent: "<b>{label}</b>: {y}%",
            showInLegend: "true",
            legendText: "{label}",
            dataPoints: chartData,
          },
        ],
      });
    })
    // respuesta negativa (en caso de error)
    .fail(function (params) {
      alert("error al buscar los datos");
    });
};
