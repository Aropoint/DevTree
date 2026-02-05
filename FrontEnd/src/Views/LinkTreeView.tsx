import DevTreeInput from "../components/DevTreeInput"
import {social} from "../data/social"
import {useEffect, useState} from "react"
import { isValidUrl } from "../utils"
import { toast } from "sonner"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateProfile } from "../api/DevTreeAPI"
import type { SocialNetwork, User } from "../types"

export default function LinkTreeView() {
  const [devTreeLinks, setDevTreeLinks] = useState(social)
  const queryClient = useQueryClient()
  const user : User = queryClient.getQueryData(['user'])!
  
  const {mutate} = useMutation({
    mutationFn: updateProfile,
    onError: (error) => {
      toast.error(error.message)
    }, 
    onSuccess: () => {
      toast.success("Actualizado correctamente")
    }
  })

  useEffect(() => {
    const updatedData = devTreeLinks.map( item => {
      const userLink = JSON.parse(user.links).find((link : SocialNetwork) => link.name === item.name)
      if (userLink) {
        return {...item, url: userLink.url, enabled: userLink.enabled}
      }
      return item
    })
    setDevTreeLinks(updatedData)
    
  }, [])

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedLinks = devTreeLinks.map(link => link.name === e.target.name ? {...link, url: e.target.value} : link)
    setDevTreeLinks(updatedLinks)

  }

  const handleEnableLink = (socialNetwork: string) => {
  setDevTreeLinks(prevLinks => {
    const toggledLinks = prevLinks.map(link => {
      if (link.name === socialNetwork) {
        if (!isValidUrl(link.url)) {
          toast.error("URL no válida")
          return link
        }
        return { ...link, enabled: !link.enabled }
      }
      return link
    })

    let idCounter = 1
    const finalLinks = toggledLinks.map(link =>
      link.enabled
        ? { ...link, id: idCounter++ }
        : { ...link, id: 0 }
    )

    queryClient.setQueryData(['user'], (prevData: User) => ({
      ...prevData,
      links: JSON.stringify(finalLinks)
    }))

    return finalLinks
  })
}


  return (
    <>
      <div className="space-y-5">
        {devTreeLinks.map(item => (
          <DevTreeInput
            key={item.name}
            item={item}
            handleUrlChange={handleUrlChange}
            handleEnableLink={handleEnableLink}
            />
        ))}
        <button className="bg-cyan-400 p-2 w-full text-lg uppercase text-slate-600 rounded-lg font-bold" onClick={() => mutate(queryClient.getQueryData(['user'])!)}>Guardar Cambios</button>
      </div>

    </>
  )
}
