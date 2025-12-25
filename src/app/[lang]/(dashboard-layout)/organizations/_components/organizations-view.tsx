"use client"

import { useEffect, useState } from "react"

import type { DictionaryType } from "@/lib/get-dictionary"
import { Organization, OrganizationMembership } from "@/types/api"

import { organizationService } from "../_services/organization.service"
import { CreateOrganizationModal } from "./create-organization-modal"
import { OrganizationCard } from "./organization-card"
import { OrganizationsHeader } from "./organizations-header"
import { OrganizationsSkeleton } from "./organizations-skeleton"

interface OrganizationsViewProps {
  dictionary: DictionaryType["organizationsPage"]
  fullDictionary: DictionaryType
}

export default function OrganizationsView({
  dictionary,
  fullDictionary,
}: OrganizationsViewProps) {
  const [memberships, setMemberships] = useState<OrganizationMembership[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  const fetchOrganizations = async () => {
    try {
      setLoading(true)
      const response = await organizationService.getUserOrganizations()
      
      if (response.success && Array.isArray(response.data)) {
        setMemberships(response.data)
      }
    } catch (error) {
      console.error("Failed to fetch organizations:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrganizations()
  }, [])

  const handleCreateSuccess = () => {
    // Refresh organizations list after creation
    fetchOrganizations()
  }

  const filteredMemberships = memberships.filter((membership) => {
    const org = membership.organizationId as Organization
    return org?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false
  })

  return (
    <div className="container py-8 lg:py-12 space-y-8">
      <OrganizationsHeader
        dictionary={dictionary.list}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onCreateClick={() => setIsCreateModalOpen(true)}
      />

      {loading ? (
        <OrganizationsSkeleton />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredMemberships.map((membership) => (
            <OrganizationCard
              key={membership._id}
              membership={membership}
              dictionary={dictionary.list}
            />
          ))}
        </div>
      )}

      <CreateOrganizationModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onSuccess={handleCreateSuccess}
        fullDictionary={fullDictionary}
        createModal={dictionary.createModal}
      />
    </div>
  )
}
