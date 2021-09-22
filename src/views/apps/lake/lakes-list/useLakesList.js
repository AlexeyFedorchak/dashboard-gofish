import { ref, watch, computed } from '@vue/composition-api'
import store from '@/store'
// import { title } from '@core/utils/filter'

// Notification
import { useToast } from 'vue-toastification/composition'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'

export default function useLakesList() {
  // Use toast
  const toast = useToast()

  const refLakesListTable = ref(null)

  // Table Handlers
  const tableColumns = [
    { key: 'lake', sortable: true },
    // { key: 'email', sortable: true },
    { key: 'role', sortable: true },
    // {
    //   key: 'currentPlan',
    //   label: 'Plan',
    //   formatter: title,
    //   sortable: true,
    // },
    { key: 'status', sortable: true },
    { key: 'actions' },
  ]
  const perPage = ref(10)
  const totalLakes = ref(0)
  const currentPage = ref(1)
  const perPageOptions = [10, 25, 50, 100]
  const searchQuery = ref('')
  const sortBy = ref('id')
  const isSortDirDesc = ref(true)
  const roleFilter = ref(null)
  const planFilter = ref(null)
  const statusFilter = ref(null)

  const dataMeta = computed(() => {
    const localItemsCount = refLakesListTable.value ? refLakesListTable.value.localItems.length : 0
    return {
      from: perPage.value * (currentPage.value - 1) + (localItemsCount ? 1 : 0),
      to: perPage.value * (currentPage.value - 1) + localItemsCount,
      of: totalLakes.value,
    }
  })

  const refetchData = () => {
    refLakesListTable.value.refresh()
  }

  watch([currentPage, perPage, searchQuery, roleFilter, planFilter, statusFilter], () => {
    refetchData()
  })

  const fetchLakes = (ctx, callback) => {
    store
      .dispatch('lakes/fetchLakes')
      .then(response => {
        const { lakes } = response
        callback(lakes)
        totalLakes.value = lakes.length
      })
      .catch(() => {
        toast({
          component: ToastificationContent,
          props: {
            title: 'Error fetching lakes list',
            icon: 'AlertTriangleIcon',
            variant: 'danger',
          },
        })
      })

    // const res = await store.dispatch('lakes/fetchLakes')
    // return res
  }

  // *===============================================---*
  // *--------- UI ---------------------------------------*
  // *===============================================---*

  // const resolveLakesRoleVariant = role => {
  //   if (role === 'fisher') return 'primary'
  //   // if (role === 'author') return 'warning'
  //   if (role === 'owner') return 'success'
  //   // if (role === 'editor') return 'info'
  //   if (role === 'admin') return 'danger'
  //   return 'primary'
  // }

  // const resolveLakesRoleIcon = role => {
  //   if (role === 'fisher') return 'LakesIcon'
  //   // if (role === 'author') return 'SettingsIcon'
  //   if (role === 'owner') return 'DatabaseIcon'
  //   // if (role === 'editor') return 'Edit2Icon'
  //   if (role === 'admin') return 'ServerIcon'
  //   return 'LakesIcon'
  // }

  // const resolveLakesStatusVariant = status => {
  //   if (status === 'pending') return 'warning'
  //   if (status === 'active') return 'success'
  //   if (status === 'inactive') return 'secondary'
  //   return 'primary'
  // }

  return {
    fetchLakes,
    tableColumns,
    perPage,
    currentPage,
    totalLakes,
    dataMeta,
    perPageOptions,
    searchQuery,
    sortBy,
    isSortDirDesc,
    refLakesListTable,
    refetchData,
  }
}
