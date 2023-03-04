/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'
import { getAccounts } from 'App/Controllers/Http/accounts'
import {
  getApplication,
  getApplications,
  updateEmail,
  updateStatusTocan,
} from 'App/Controllers/Http/applications'
import {
  confirmEmail,
  forgotPassword,
  refreshToken,
  resetPassword,
  signin,
  signup,
} from 'App/Controllers/Http/auth'
import {
  createAutomat,
  getAutomatModels,
  getAutomats,
  getAutomatsByFilter,
} from 'App/Controllers/Http/automats'
import {
  createAutomatGroup,
  deleteAutomatGroup,
  getAutomatGroups,
  updateAutomatGroup,
  updateAutomatGroups,
} from 'App/Controllers/Http/automats/groups'
import { automatProductsCopy, updateAutomatProduct } from 'App/Controllers/Http/automats/products'
import {
  createPulsePlanogramUnits,
  getPulsePlanogramUnits,
  updatePulsePlanogramUnits,
} from 'App/Controllers/Http/automats/pulsePlanograms'
import {
  automatSettingCopy,
  getAutomatSetting,
  updateAutomatSetting,
} from 'App/Controllers/Http/automats/settings'
import {
  createDevice,
  createDeviceTest,
  createServiceMenuStatuses,
  deleteDevice,
  getDevicesByFilter,
} from 'App/Controllers/Http/cube'
import {
  createDevicePin,
  deleteDevicePin,
  getDevicePins,
} from 'App/Controllers/Http/devices/devicesPins'
import { deleteIntegration, generateKey, getIntegration } from 'App/Controllers/Http/integration'
import { getMonitoringData } from 'App/Controllers/Http/monitoring'
import {
  getRemainsReport,
  getRouteReport,
  getSales,
} from 'App/Controllers/Http/monitoring/automats'
import { createSales } from 'App/Controllers/Http/monitoring/sales'
import {
  createProduct,
  createProducts,
  getProducts,
  getProductsRecipesIngredients,
  moveProductsRecipes,
} from 'App/Controllers/Http/products'
import { getReserviors, updateReserviors } from 'App/Controllers/Http/products/reserviors'
import {
  exportReceipts,
  getReceipt,
  getReceipts,
  resendReceiptToFiscalization,
} from 'App/Controllers/Http/receipts'
import {
  createRouteAutomatComment,
  createRouteComment,
  deleteRouteAutomatComment,
  deleteRouteComment,
  getRouteAutomatComments,
  updateRouteAutomatComment,
  updateRouteComment,
} from 'App/Controllers/Http/routes/comments'
import { updateRouteAutomatProductsReserviors } from 'App/Controllers/Http/routes/productsReserviors'
import { loadRouteAutomat } from 'App/Controllers/Http/routes/routeAutomats'
import {
  changeRoutesStatus,
  copyRoutes,
  createRoute,
  getRoute,
  routeAutomatsFullLoad,
} from 'App/Controllers/Http/routes/routes'
import { getSetting, updateSetting } from 'App/Controllers/Http/settings'
import {
  confirmInvitation,
  deleteUsers,
  discardInvitation,
  getUserByToken,
  getUsers,
  inviteUser,
  updateUser,
} from 'App/Controllers/Http/users'

const apiPrefix = '/api'

Route.post('/api/signin', signin)
Route.post('/api/signup', signup)
Route.post('/api/forgot/password', forgotPassword)
Route.post('/api/refresh/token', refreshToken)
Route.get('/api/applications/:id', getApplication)
Route.get('/api/receipts/export', exportReceipts)
Route.post('/api/update-status-binbank', updateStatusTocan)
Route.post('/api/update-status-tocan', updateStatusTocan)
Route.get('/api/discard/invitation/:token', discardInvitation)

Route.group(() => {
  Route.get('/confirm/email', confirmEmail)
  Route.post('/confirm/invitation', confirmInvitation)
  Route.post('/reset/password', resetPassword)
  Route.get('/get/user/by/:token', getUserByToken)

  Route.post('/automats', createAutomat)
  Route.get('/automats', getAutomats)
  Route.get('/automat/filter', getAutomatsByFilter)

  Route.get('/automat/models', getAutomatModels)

  Route.post('/automat/groups', createAutomatGroup)
  Route.get('/automat/groups', getAutomatGroups)
  Route.patch('/automat/groups', updateAutomatGroups)
  Route.delete('/automat/groups/:id', deleteAutomatGroup)
  Route.patch('/automat/groups/:id', updateAutomatGroup)

  Route.get('/automat/settings/:automatId', getAutomatSetting)
  Route.patch('/automat/settings/:automatId', updateAutomatSetting)
  Route.get('/automat/settings/:fromAutomatId/:toAutomatId', automatSettingCopy)

  Route.post('/automat/products', updateAutomatProduct)
  Route.post('/automat/products/copy/:fromAutomatId/:toAutomatId', automatProductsCopy)

  Route.get('/automat/remains-report', getRemainsReport)
  Route.get('/automat/route-report', getRouteReport)

  Route.get('/automat/sales', getSales)
  Route.post('/sales', createSales)

  Route.post('/routes', createRoute)
  Route.get('/routes/:id', getRoute)
  Route.patch(
    '/route/automat/products/reserviors/:routeId/:routeAutomatId',
    updateRouteAutomatProductsReserviors
  )
  Route.patch('/route/automat/load/:routeId/:routeAutomatId', loadRouteAutomat)
  Route.post('/route/copy', copyRoutes)
  Route.patch('/route/status', changeRoutesStatus)
  Route.patch('/route/automats/fullLoad/:routeId', routeAutomatsFullLoad)

  Route.post('/route/comment/:routeId', createRouteComment)
  Route.patch('/route/comment/:routeId/:commentId', updateRouteComment)
  Route.delete('/route/comment/:commentId', deleteRouteComment)
  Route.get('/route/automat/comment/:routeId/:automatId', getRouteAutomatComments)
  Route.post('/route/automat/comment/:routeId/:automatId', createRouteAutomatComment)
  Route.patch('/route/automat/comment/:routeId/:automatId/:commentId', updateRouteAutomatComment)
  Route.delete('/route/automat/comment/:commentId', deleteRouteAutomatComment)

  Route.get('/monitorings', getMonitoringData)

  Route.get('/products', getProductsRecipesIngredients)
  Route.get('/product/ordinary', getProducts)
  Route.post('/products', createProduct)
  Route.post('/product/bulk', createProducts)
  Route.patch('/products', moveProductsRecipes)

  Route.get('/reserviors/:automatId', getReserviors)
  Route.patch('/reserviors', updateReserviors)

  Route.patch('/settings', updateSetting)
  Route.get('/settings', getSetting)

  Route.post('/invite/user', inviteUser)
  Route.get('/users', getUsers)
  Route.patch('/users', updateUser)
  Route.delete('/users', deleteUsers)

  Route.get('/applications', getApplications)
  Route.patch('/applications/:id/email', updateEmail)

  Route.get('/receipts', getReceipts)
  Route.get('/receipt/:id', getReceipt)
  Route.get('/receipt/fiscalization/:id', resendReceiptToFiscalization)

  Route.patch('/integrations', generateKey)
  Route.get('/integrations', getIntegration)
  Route.delete('/integrations', deleteIntegration)

  Route.get('/pulse/planogram/units', getPulsePlanogramUnits)
  Route.post('/pulse/planogram/units', createPulsePlanogramUnits)
  Route.patch('/pulse/planogram/units', updatePulsePlanogramUnits)

  Route.post('/devices/pins', createDevicePin)
  Route.get('/devices/pins', getDevicePins)
  Route.delete('/devices/pins/:id', deleteDevicePin)

  Route.post('/cube/service/menu/statues', createServiceMenuStatuses)
  Route.get('/device/filter', getDevicesByFilter)
  Route.post('/devices/test', createDeviceTest)
})
  .prefix(apiPrefix)
  .middleware(['auth'])

Route.group(() => {
  Route.get('/accounts', getAccounts)
  Route.post('/devices', createDevice)
  Route.delete('/devices', deleteDevice)
})
  .prefix(apiPrefix)
  .middleware(['authTrustedApp'])
