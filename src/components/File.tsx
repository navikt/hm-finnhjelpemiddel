import { dateToString } from '@/utils/string-util'

import { FileIcon } from '@/components/aksel-client'

const File = ({ title, path, date }: { title: string; path: string; date?: Date }) => {
  const documentLoader = (path: string) => {
    return `${process.env.CDN_URL}${path}`
  }

  return (
    <div className="file-container">
      <FileIcon aria-hidden fontSize="1.5rem" />
      {date ? (
        <div className="file-container__with-date">
          <a href={documentLoader(path)} target="_blank" rel="noreferrer">
            <span>{title} (PDF) </span>
          </a>
          <span>{dateToString(date)} </span>
        </div>
      ) : (
        <a href={documentLoader(path)} target="_blank" rel="noreferrer">
          <span>{title} (PDF) </span>
        </a>
      )}

      {title.length == 0 && (
        <a href={documentLoader(path)} target="_blank" rel="noreferrer">
          <FileIcon aria-hidden fontSize="1.55rem" />
          Dokument uten navn (PDF)
        </a>
      )}
    </div>
  )
}

export default File
