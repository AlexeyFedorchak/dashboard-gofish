import { ref, watch, computed } from '@vue/composition-api'
import store from '@/store'

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
    { key: 'role', sortable: true },
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
    store.dispatch('lakes/fetchLakes')
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
  }

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
