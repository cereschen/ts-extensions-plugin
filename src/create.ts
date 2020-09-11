import tss from "typescript/lib/tsserverlibrary";
import path from "path";

export function makeCreate (mod: { typescript: typeof tss }) {

  return function create (info: tss.server.PluginCreateInfo): tss.LanguageService {
    const logger = (msg: string) => info.project.projectService.logger.info(`[my-typescript-plugin] ${msg}`);

    const proxy = new Proxy(info.languageService, {
      get (target, p: keyof tss.LanguageService) {
        if (p === "getDefinitionAndBoundSpan") {
          return (fileName: string, pos: number) => {
            let result = target.getDefinitionAndBoundSpan(fileName, pos)
            let Program = target.getProgram()
            let str = Program.getSourceFile(fileName).text.substr(result.textSpan.start, result.textSpan.length)
            let extensions = info.config.extensions || ['vue','svelte', 'scss', 'css', 'less', 'png', 'svg']
            let matchRelative = str.match(new RegExp(`^['"]([.][^]*[.](?:${extensions.join('|')}))['"]$`))
            if (matchRelative) {

              result.definitions[0].fileName = path.resolve(fileName, '../', matchRelative[1])
              return result
            } else {
              let match = null
              let relative = ''

              for (let i in Program.getCompilerOptions().paths) {
                let re = new RegExp(`^['"]${i.substr(0, i.length - 1)}([^]*[.](?:${extensions.join('|')}))['"]$`)

                match = str.match(re)
                if (match) {
                  let r = Program.getCompilerOptions().paths[i][0]

                  relative = r.substr(0, r.length - 1)
                }
              }

              if (match) {
                let dir = info.project.getCurrentDirectory()

                result.definitions[0].fileName = dir + '/' + relative + match[1]
                return result
              }

            }
            return target[p](fileName, pos)
          }
        }

        return target[p]
      }
    })

    return proxy
  }
}