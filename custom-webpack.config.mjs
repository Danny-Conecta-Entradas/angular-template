// import * as webpack from 'webpack'
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'

// Enlaces de referencia para crear configuración:
// https://stackoverflow.com/questions/51068908/angular-cli-custom-webpack-config
// https://github.com/just-jeb/angular-builders/tree/master/packages/custom-webpack#Custom-webpack-browser
// https://github.com/just-jeb/angular-builders/tree/master/packages/custom-webpack#custom-webpack-config-function
// https://webpack.js.org/plugins/css-minimizer-webpack-plugin/
// https://medium.com/@avdhoot.980/minimize-extracted-css-file-using-webpack-cssminimizerwebpackplugin-636760d1ebfc

/*

  Definición del problema:

    - En este proyecto se está haciendo uso anidación de selectores en CSS
      https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_nesting/Using_CSS_nesting

    - Aparentemente Angular a la hora de emular la encapsulación ignora los selectores anidados
      lo que provoca que se puedan filtrar estilos en componentes que no pertencen
      al sobre el que se está trabajando

    - En producción este problema no se visualiza ya que el minificador utilizado
      por Angular por defecto transforma estos selectores anidados en selectores puros (sin anidación)

    - El que se filtren estilos puede ser o no un inconveniente según como se mire
      pero el mayor inconveniente que veo es la potencial diferencia que puede haber
      en la aplicación entre el modo desarrollo y el modo producción


  Planteamiento de una posible solución:

    - Crear una configuración personalizada de Webpack que elimine el minificador
      de CSS usado en la configuración por defecto de Angular y reemplazarlo por otro
      que no modifique los selectores anidados, consiguiendo de esta manera que
      no haya ninguna diferencia de estilos entre desarrollo y producción

*/


/**
 * @param {import('webpack').Configuration} config
 * @param {import('@angular-builders/custom-webpack').CustomWebpackBrowserSchema} options
 * @param {import('@angular-builders/custom-webpack').TargetOptions} targetOptions
 */
export default (config, options, targetOptions) => {
  config.plugins.push(
    new MiniCssExtractPlugin(),
  )

  const default_css_plugin_minimizer_name = 'CssOptimizerPlugin'

  // Eliminar minificador de CSS por defecto de Angular
  config.optimization.minimizer = config.optimization.minimizer.filter(
    minimizer => minimizer.constructor.name !== default_css_plugin_minimizer_name
  )

  // Deshabilitar optimizaciones de CssMinimizerPlugin que pueden provocar
  // que el CSS generado no sea equivalente al original.
  // https://cssnano.github.io/cssnano/docs/what-are-optimisations/
  const cssNanoOptimizations = {
    mergeLonghand: false,
    mergeRules: false,
    cssDeclarationSorter: false,
    convertValues: false,
    discardOverridden: false,
    minifyFontValues: false,
    minifyGradients: false,
    minifySelectors: false,
    normalizeDisplayValues: false,
    normalizePositions: false,
    normalizeRepeatStyle: false,
    normalizeString: false,
    normalizeTimingFunctions: false,
    normalizeUnicode: false,
    normalizeUrl: false,
    orderedValues: false,
    reduceInitial: false,
    reduceTransforms: false,
    svgo: false,
    uniqueSelectors: false,
  }

  // Añadir minificador de CSS que no transforma los selectores anidados
  // en selectores puros.
  config.optimization.minimizer.push(
    new CssMinimizerPlugin({
      minimizerOptions: {
        preset: ['default', cssNanoOptimizations],
      }
    }),
  )

  return config
}
