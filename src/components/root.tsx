import Html from '@kitajs/html'

interface Props {
  children?: Html.Children
  title?: string
  includeMaskPlugin?: boolean
  stylesheets?: string[]
}
export const BaseHtml = (props: Props) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Explore vast collection of makeup and skincare products from countless brands.">
  <title>${props.title || 'Eros | Makeup and skin care marketplace'}</title>
  <script src="/scripts/htmx.js" defer></script>
  ${
  props.includeMaskPlugin
    ? '<script defer src="https://cdn.jsdelivr.net/npm/@alpinejs/mask@3.x.x/dist/cdn.min.js"></script>'
    : ''
}
  <script src="/alpine.js" defer></script>
  <script src="/scripts/svg-inject.js" ></script>
  <link href="/styles/global.css" rel="stylesheet">
  <link href="/styles/general-sans.css" rel="stylesheet" defer>
  <link href="/styles/boska.css" rel="stylesheet" defer>
  ${
  !props.stylesheets
    ? ''
    : props.stylesheets?.map((href) => `<link href="${href}" rel="stylesheet">`)
      .join('')
}
  ${
  process.env.NODE_ENV === 'production'
    ? ''
    : '<script src="http://localhost:35729/livereload.js"></script>'
}
</head>

${props.children}
`
