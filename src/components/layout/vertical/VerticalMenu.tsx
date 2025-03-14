// MUI Imports
import { useTheme } from '@mui/material/styles'

// Third-party Imports
import PerfectScrollbar from 'react-perfect-scrollbar'

// Type Imports
import type { VerticalMenuContextProps } from '@menu/components/vertical-menu/Menu'

// Component Imports
import { Menu, SubMenu, MenuItem } from '@menu/vertical-menu'

// import CustomChip from '@core/components/mui/Chip'

// import { GenerateVerticalMenu } from '@components/GenerateMenu'

// Hook Imports
import useVerticalNav from '@menu/hooks/useVerticalNav'

// Styled Component Imports
import StyledVerticalNavExpandIcon from '@menu/styles/vertical/StyledVerticalNavExpandIcon'

// Style Imports
// import menuItemStyles from '@core/styles/vertical/menuItemStyles'
import menuSectionStyles from '@core/styles/vertical/menuSectionStyles'

import { menuClasses } from '@menu/utils/menuClasses'
import Iconify from '@/components/iconify'

// import menuItemStyles from '@/configs/menuItemStyles'

// Menu Data Imports
// import menuData from '@/data/navigation/verticalMenuData'

type RenderExpandIconProps = {
  open?: boolean
  transitionDuration?: VerticalMenuContextProps['transitionDuration']
}

type Props = {
  scrollMenu: (container: any, isPerfectScrollbar: boolean) => void
}

const RenderExpandIcon = ({ open, transitionDuration }: RenderExpandIconProps) => (
  <StyledVerticalNavExpandIcon open={open} transitionDuration={transitionDuration}>
    <i className='tabler-chevron-right' />
  </StyledVerticalNavExpandIcon>
)

const VerticalMenu = ({ scrollMenu }: Props) => {
  // Hooks
  const theme = useTheme()
  const verticalNavOptions = useVerticalNav()

  // Vars
  const { isBreakpointReached, transitionDuration, isHovered, isCollapsed, isPopoutWhenCollapsed } = verticalNavOptions
  const popoutCollapsed = isPopoutWhenCollapsed && isCollapsed

  const ScrollWrapper = isBreakpointReached ? 'div' : PerfectScrollbar

  return (
    // eslint-disable-next-line lines-around-comment
    /* Custom scrollbar instead of browser scroll, remove if you want browser scroll only */
    <ScrollWrapper
      {...(isBreakpointReached
        ? {
            className: 'bs-full overflow-y-auto overflow-x-hidden',
            onScroll: container => scrollMenu(container, false)
          }
        : {
            options: { wheelPropagation: false, suppressScrollX: true },
            onScrollY: container => scrollMenu(container, true)
          })}
    >
      {/* Incase you also want to scroll NavHeader to scroll with Vertical Menu, remove NavHeader from above and paste it below this comment */}
      {/* Vertical Menu */}
      <Menu
        popoutMenuOffset={{ mainAxis: 23 }}
        renderExpandIcon={({ open }) => <RenderExpandIcon open={open} transitionDuration={transitionDuration} />}
        renderExpandedMenuItemIcon={{ icon: <i className='tabler-circle text-xs' /> }}
        subMenuOpenBehavior='collapse'
        menuSectionStyles={{
          ...menuSectionStyles(verticalNavOptions, theme),
          label: {
            color: '#fff'
          }
        }}
        menuItemStyles={{
          root: ({ level }) => ({
            [`&.${menuClasses.subMenuRoot}.${menuClasses.open} > .${menuClasses.button}, &.${menuClasses.subMenuRoot} > .${menuClasses.button}.${menuClasses.active}`]:
              {
                backgroundColor: 'rgb(255,255,255,0.3) !important',
                color: '#fff !important'
              },
            [`&:not(.${menuClasses.subMenuRoot}) > .${menuClasses.button}.${menuClasses.active}`]: {
              ...(popoutCollapsed && level > 0
                ? {
                    backgroundColor: 'var(--mui-palette-primary-lightOpacity)',
                    color: 'var(--mui-palette-primary-main)',
                    [`& .${menuClasses.icon}`]: {
                      color: 'var(--mui-palette-primary-main)'
                    }
                  }
                : {
                    color: 'var(--mui-palette-primary-contrastText)',
                    background:
                      theme.direction === 'ltr'
                        ? `linear-gradient(270deg,
                            rgb(var(--mui-palette-primary-mainChannel) / 0.7) 0%,
                            var(--mui-palette-primary-main) 100%) !important`
                        : `linear-gradient(270deg,
                             var(--mui-palette-primary-main) 100%,
                             rgb(var(--mui-palette-primary-mainChannel) / 0.7) 100%) !important`,
                    boxShadow: 'var(--mui-customShadows-primary-sm)',
                    [`& .${menuClasses.icon}`]: {
                      color: 'inherit'
                    }
                  })
            }
          }),
          button: ({ disabled, open, level, active }) => ({
            ...(level === 1 && { paddingInlineStart: '20px' }),
            paddingBlock: '8px',
            paddingInline: '12px',
            borderRadius: '12px',
            fontWeight: open ? 500 : 400,
            color: disabled ? '#a19e9e' : '#fefefe',

            ...(!(isCollapsed && !isHovered) && {
              '&:has(.MuiChip-root)': {
                paddingBlock: theme.spacing(1.75)
              }
            }),

            ...(!active && {
              '&:hover, &:focus-visible': {
                backgroundColor: 'rgb(255,255,255,0.4)',
                color: '#fefefe'
              },
              '&[aria-expanded="true"]': {
                backgroundColor: 'var(--mui-palette-action-selected)'
              }
            })
          }),
          subMenuContent(params) {
            const { level } = params

            return {
              paddingBlock: '8px',
              paddingInline: level === 1 ? '5px' : '10px'
            }
          }
        }}
      >
        <MenuItem
          href='/homepage'
          icon={<Iconify icon='solar:home-2-linear' />}
          exactMatch={false}
          activeUrl='/homepage'
        >
          TRANG CHỦ
        </MenuItem>
        <SubMenu label='DANH MỤC' icon={<Iconify icon='solar:widget-2-linear' />}>
          <MenuItem
            href='/term-management'
            icon={<Iconify icon='solar:calendar-mark-linear' />}
            exactMatch={false}
            activeUrl='/term-management'
          >
            Học kỳ
          </MenuItem>
          <MenuItem
            href='/cohort-management'
            icon={<Iconify icon='hugeicons:students' />}
            exactMatch={false}
            activeUrl='/cohort-management'
          >
            Niên khóa
          </MenuItem>
          <MenuItem
            href='/major-management'
            icon={<Iconify icon='ph:certificate' />}
            exactMatch={false}
            activeUrl='/major-management'
          >
            Ngành
          </MenuItem>
          <MenuItem href='/type-process' icon={<Iconify icon='material-symbols:problem-outline-rounded' />}>
            Loại xử lý
          </MenuItem>
          <MenuItem href='/process-result' icon={<Iconify icon='carbon:result' />}>
            Kết quả xử lý
          </MenuItem>
        </SubMenu>
        <SubMenu label='NGƯỜI DÙNG' icon={<Iconify icon='solar:users-group-rounded-linear' />}>
          <MenuItem
            href='/role-management'
            icon={<Iconify icon='solar:shield-user-linear' />}
            exactMatch={false}
            activeUrl='/role-management'
          >
            Vai trò
          </MenuItem>
          <MenuItem href='/lecturer-management' icon={<Iconify icon='clarity:employee-group-line' />}>
            Cbnv-Gv
          </MenuItem>
          <MenuItem href='/student-management' icon={<Iconify icon='ph:student' />}>
            Sinh viên
          </MenuItem>
        </SubMenu>
        <MenuItem href='/class-management' icon={<Iconify icon='ph:chalkboard-teacher' />}>
          PHÂN CÔNG LỚP
        </MenuItem>
        <SubMenu label='LỚP NIÊN CHẾ' icon={<Iconify icon='fluent:class-24-regular' />}>
          <MenuItem href='/classLecturer' icon={<Iconify icon='fluent:class-24-regular' />}>
            Lớp học
          </MenuItem>
          <MenuItem href='/classStudent' icon={<Iconify icon='hugeicons:students' />}>
            Sinh viên
          </MenuItem>
        </SubMenu>
        <SubMenu label='XỬ LÝ HỌC TẬP' icon={<Iconify icon='fluent:task-list-square-person-20-regular' />}>
          <MenuItem href='/learning-processing' icon={<Iconify icon='fluent:task-list-square-person-20-regular' />}>
            Kỳ XLHV
          </MenuItem>
          <MenuItem href='/commitment-forms' icon={<Iconify icon='icon-park-outline:doc-detail' />}>
            Đơn cam kết
          </MenuItem>
        </SubMenu>
        <SubMenu label='SINH VIÊN' icon={<Iconify icon='ph:student' />}>
          <MenuItem href='/student-acedemic-process' icon={<Iconify icon='carbon:result' />}>
            Xử lý học vụ
          </MenuItem>
        </SubMenu>
        {/* <SubMenu
          label='dashboards'
          icon={<i className='tabler-smart-home' />}
          suffix={<CustomChip label='5' size='small' color='error' round='true' />}
        >
          <MenuItem href='/dashboards/crm'>crm</MenuItem>
          <MenuItem href='/dashboards/analytics'>analytics</MenuItem>
          <MenuItem href='/dashboards/ecommerce'>eCommerce</MenuItem>
          <MenuItem href='/dashboards/academy'>academy</MenuItem>
          <MenuItem href='/dashboards/logistics'>logistics</MenuItem>
        </SubMenu>
        <SubMenu label='frontPages' icon={<i className='tabler-files' />}>
          <MenuItem href='/front-pages/landing-page' target='_blank'>
            landing
          </MenuItem>
          <MenuItem href='/front-pages/pricing' target='_blank'>
            pricing
          </MenuItem>
          <MenuItem href='/front-pages/payment' target='_blank'>
            payment
          </MenuItem>
          <MenuItem href='/front-pages/checkout' target='_blank'>
            checkout
          </MenuItem>
          <MenuItem href='/front-pages/help-center' target='_blank'>
            helpCenter
          </MenuItem>
        </SubMenu>
        <MenuSection label='appsPages'>
          <SubMenu label='eCommerce' icon={<i className='tabler-shopping-cart' />}>
            <MenuItem href='/apps/ecommerce/dashboard'>dashboard</MenuItem>
            <SubMenu label='products'>
              <MenuItem href='/apps/ecommerce/products/list'>list</MenuItem>
              <MenuItem href='/apps/ecommerce/products/add'>add</MenuItem>
              <MenuItem href='/apps/ecommerce/products/category'>category</MenuItem>
            </SubMenu>
            <SubMenu label='orders'>
              <MenuItem href='/apps/ecommerce/orders/list'>list</MenuItem>
              <MenuItem
                href='/apps/ecommerce/orders/details/5434'
                exactMatch={false}
                activeUrl='/apps/ecommerce/orders/details'
              >
                details
              </MenuItem>
            </SubMenu>
            <SubMenu label='customers'>
              <MenuItem href='/apps/ecommerce/customers/list'>list</MenuItem>
              <MenuItem
                href='/apps/ecommerce/customers/details/879861'
                exactMatch={false}
                activeUrl='/apps/ecommerce/customers/details'
              >
                details
              </MenuItem>
            </SubMenu>
            <MenuItem href='/apps/ecommerce/manage-reviews'>manageReviews</MenuItem>
            <MenuItem href='/apps/ecommerce/referrals'>referrals</MenuItem>
            <MenuItem href='/apps/ecommerce/settings'>settings</MenuItem>
          </SubMenu>
          <SubMenu label='academy' icon={<i className='tabler-school' />}>
            <MenuItem href='/apps/academy/dashboard'>dashboard</MenuItem>
            <MenuItem href='/apps/academy/my-courses'>myCourses</MenuItem>
            <MenuItem href='/apps/academy/course-details'>courseDetails</MenuItem>
          </SubMenu>
          <SubMenu label='logistics' icon={<i className='tabler-truck' />}>
            <MenuItem href='/apps/logistics/dashboard'>dashboard</MenuItem>
            <MenuItem href='/apps/logistics/fleet'>fleet</MenuItem>
          </SubMenu>
          <MenuItem href='/apps/email' icon={<i className='tabler-mail' />} exactMatch={false} activeUrl='/apps/email'>
            email
          </MenuItem>
          <MenuItem href='/apps/chat' icon={<i className='tabler-message-circle-2' />}>
            chat
          </MenuItem>
          <MenuItem href='/apps/calendar' icon={<i className='tabler-calendar' />}>
            calendar
          </MenuItem>
          <MenuItem href='/apps/kanban' icon={<i className='tabler-copy' />}>
            kanban
          </MenuItem>
          <SubMenu label='invoice' icon={<i className='tabler-file-description' />}>
            <MenuItem href='/apps/invoice/list'>list</MenuItem>
            <MenuItem href='/apps/invoice/preview/4987' exactMatch={false} activeUrl='/apps/invoice/preview'>
              preview
            </MenuItem>
            <MenuItem href='/apps/invoice/edit/4987' exactMatch={false} activeUrl='/apps/invoice/edit'>
              edit
            </MenuItem>
            <MenuItem href='/apps/invoice/add'>add</MenuItem>
          </SubMenu>
          <SubMenu label='user' icon={<i className='tabler-user' />}>
            <MenuItem href='/apps/user/list'>list</MenuItem>
            <MenuItem href='/apps/user/view'>view</MenuItem>
          </SubMenu>
          <SubMenu label='rolesPermissions' icon={<i className='tabler-lock' />}>
            <MenuItem href='/apps/roles'>roles</MenuItem>
            <MenuItem href='/apps/permissions'>permissions</MenuItem>
          </SubMenu>
          <SubMenu label='pages' icon={<i className='tabler-file' />}>
            <MenuItem href='/pages/user-profile'>userProfile</MenuItem>
            <MenuItem href='/pages/account-settings'>accountSettings</MenuItem>
            <MenuItem href='/pages/faq'>faq</MenuItem>
            <MenuItem href='/pages/pricing'>pricing</MenuItem>
            <SubMenu label='miscellaneous'>
              <MenuItem href='/pages/misc/coming-soon' target='_blank'>
                comingSoon
              </MenuItem>
              <MenuItem href='/pages/misc/under-maintenance' target='_blank'>
                underMaintenance
              </MenuItem>
              <MenuItem href='/pages/misc/404-not-found' target='_blank'>
                pageNotFound404
              </MenuItem>
              <MenuItem href='/pages/misc/401-not-authorized' target='_blank'>
                notAuthorized401
              </MenuItem>
            </SubMenu>
          </SubMenu>
          <SubMenu label='authPages' icon={<i className='tabler-shield-lock' />}>
            <SubMenu label='login'>
              <MenuItem href='/pages/auth/login-v1' target='_blank'>
                loginV1
              </MenuItem>
              <MenuItem href='/pages/auth/login-v2' target='_blank'>
                loginV2
              </MenuItem>
            </SubMenu>
            <SubMenu label='register'>
              <MenuItem href='/pages/auth/register-v1' target='_blank'>
                registerV1
              </MenuItem>
              <MenuItem href='/pages/auth/register-v2' target='_blank'>
                registerV2
              </MenuItem>
              <MenuItem href='/pages/auth/register-multi-steps' target='_blank'>
                registerMultiSteps
              </MenuItem>
            </SubMenu>
            <SubMenu label='verifyEmail'>
              <MenuItem href='/pages/auth/verify-email-v1' target='_blank'>
                verifyEmailV1
              </MenuItem>
              <MenuItem href='/pages/auth/verify-email-v2' target='_blank'>
                verifyEmailV2
              </MenuItem>
            </SubMenu>
            <SubMenu label='forgotPassword'>
              <MenuItem href='/pages/auth/forgot-password-v1' target='_blank'>
                forgotPasswordV1
              </MenuItem>
              <MenuItem href='/pages/auth/forgot-password-v2' target='_blank'>
                forgotPasswordV2
              </MenuItem>
            </SubMenu>
            <SubMenu label='resetPassword'>
              <MenuItem href='/pages/auth/reset-password-v1' target='_blank'>
                resetPasswordV1
              </MenuItem>
              <MenuItem href='/pages/auth/reset-password-v2' target='_blank'>
                resetPasswordV2
              </MenuItem>
            </SubMenu>
            <SubMenu label='twoSteps'>
              <MenuItem href='/pages/auth/two-steps-v1' target='_blank'>
                twoStepsV1
              </MenuItem>
              <MenuItem href='/pages/auth/two-steps-v2' target='_blank'>
                twoStepsV2
              </MenuItem>
            </SubMenu>
          </SubMenu>
          <SubMenu label='wizardExamples' icon={<i className='tabler-dots' />}>
            <MenuItem href='/pages/wizard-examples/checkout'>checkout</MenuItem>
            <MenuItem href='/pages/wizard-examples/property-listing'>propertyListing</MenuItem>
            <MenuItem href='/pages/wizard-examples/create-deal'>createDeal</MenuItem>
          </SubMenu>
          <MenuItem href='/pages/dialog-examples' icon={<i className='tabler-square' />}>
            dialogExamples
          </MenuItem>
          <SubMenu label='widgetExamples' icon={<i className='tabler-chart-bar' />}>
            <MenuItem href='/pages/widget-examples/basic'>basic</MenuItem>
            <MenuItem href='/pages/widget-examples/advanced'>advanced</MenuItem>
            <MenuItem href='/pages/widget-examples/statistics'>statistics</MenuItem>
            <MenuItem href='/pages/widget-examples/charts'>charts</MenuItem>
            <MenuItem href='/pages/widget-examples/actions'>actions</MenuItem>
          </SubMenu>
        </MenuSection>
        <MenuSection label='formsAndTables'>
          <MenuItem href='/forms/form-layouts' icon={<i className='tabler-layout' />}>
            formLayouts
          </MenuItem>
          <MenuItem href='/forms/form-validation' icon={<i className='tabler-checkup-list' />}>
            formValidation
          </MenuItem>
          <MenuItem href='/forms/form-wizard' icon={<i className='tabler-git-merge' />}>
            formWizard
          </MenuItem>
          <MenuItem href='/react-table' icon={<i className='tabler-table' />}>
            reactTable
          </MenuItem>
          <MenuItem
            icon={<i className='tabler-checkbox' />}
            href={`${process.env.NEXT_PUBLIC_DOCS_URL}/docs/user-interface/form-elements`}
            suffix={<i className='tabler-external-link text-xl' />}
            target='_blank'
          >
            formELements
          </MenuItem>
          <MenuItem
            icon={<i className='tabler-layout-board-split' />}
            href={`${process.env.NEXT_PUBLIC_DOCS_URL}/docs/user-interface/mui-table`}
            suffix={<i className='tabler-external-link text-xl' />}
            target='_blank'
          >
            muiTables
          </MenuItem>
        </MenuSection>
        <MenuSection label='chartsMisc'>
          <SubMenu label='charts' icon={<i className='tabler-chart-donut-2' />}>
            <MenuItem href='/charts/apex-charts'>apex</MenuItem>
            <MenuItem href='/charts/recharts'>recharts</MenuItem>
          </SubMenu>
          <MenuItem
            icon={<i className='tabler-cards' />}
            href={`${process.env.NEXT_PUBLIC_DOCS_URL}/docs/user-interface/foundation`}
            suffix={<i className='tabler-external-link text-xl' />}
            target='_blank'
          >
            foundation
          </MenuItem>
          <MenuItem
            icon={<i className='tabler-atom' />}
            href={`${process.env.NEXT_PUBLIC_DOCS_URL}/docs/user-interface/components`}
            suffix={<i className='tabler-external-link text-xl' />}
            target='_blank'
          >
            components
          </MenuItem>
          <MenuItem
            icon={<i className='tabler-list-search' />}
            href={`${process.env.NEXT_PUBLIC_DOCS_URL}/docs/menu-examples/overview`}
            suffix={<i className='tabler-external-link text-xl' />}
            target='_blank'
          >
            menuExamples
          </MenuItem>
          <MenuItem
            icon={<i className='tabler-lifebuoy' />}
            suffix={<i className='tabler-external-link text-xl' />}
            target='_blank'
            href='https://pixinvent.ticksy.com'
          >
            raiseSupport
          </MenuItem>
          <MenuItem
            icon={<i className='tabler-book-2' />}
            suffix={<i className='tabler-external-link text-xl' />}
            target='_blank'
            href={`${process.env.NEXT_PUBLIC_DOCS_URL}`}
          >
            documentation
          </MenuItem>
          <SubMenu label='others' icon={<i className='tabler-box' />}>
            <MenuItem suffix={<CustomChip label='New' size='small' color='info' round='true' />}>
              itemWithBadge
            </MenuItem>
            <MenuItem
              href='https://pixinvent.com'
              target='_blank'
              suffix={<i className='tabler-external-link text-xl' />}
            >
              externalLink
            </MenuItem>
            <SubMenu label='menuLevels'>
              <MenuItem>menuLevel2</MenuItem>
              <SubMenu label='menuLevel2'>
                <MenuItem>menuLevel3</MenuItem>
                <MenuItem>menuLevel3</MenuItem>
              </SubMenu>
            </SubMenu>
            <MenuItem disabled>disabledMenu</MenuItem>
          </SubMenu>
        </MenuSection> */}
      </Menu>
      {/* <Menu
        popoutMenuOffset={{ mainAxis: 23 }}
        menuItemStyles={menuItemStyles(verticalNavOptions, theme)}
        renderExpandIcon={({ open }) => <RenderExpandIcon open={open} transitionDuration={transitionDuration} />}
        renderExpandedMenuItemIcon={{ icon: <i className='tabler-circle text-xs' /> }}
        menuSectionStyles={menuSectionStyles(verticalNavOptions, theme)}
      >
        <GenerateVerticalMenu menuData={menuData(dictionary)} />
      </Menu> */}
    </ScrollWrapper>
  )
}

export default VerticalMenu
