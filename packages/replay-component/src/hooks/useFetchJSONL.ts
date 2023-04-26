import { useEffect, useState } from 'react'

export const useFetchJSONL = <T>(url: string) => {
  const [data, setData] = useState<T>()

  useEffect(() => {
    fetch(url)
      .then(response => {
        const text = response.text()
        return text
      })
      .then(jsonL => {
        const jsonLines = jsonL.trim().split('\n')
        // TODO: use a proper event decoder here
        const jsonData = jsonLines.map(jsonString =>
          JSON.parse(jsonString.trim()),
        ) as unknown as T
        setData(jsonData)
        return jsonData
      })
      .catch(error => {
        console.error('Error:', error)
      })
  }, [url])
  return data
}
