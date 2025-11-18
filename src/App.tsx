import './App.css'

function App() {
  return (

	<div
      className="relative flex h-auto min-h-screen w-full flex-col bg-[#221911] dark group/design-root overflow-x-hidden"
      style={{ fontFamily: 'Epilogue, "Noto Sans", sans-serif' }}
    >
      <div className="layout-container flex h-full grow flex-col">
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#483423] px-10 py-3">
          <div className="flex items-center gap-4 text-white">
            <div className="size-4">
              <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 4H17.3334V17.3334H30.6666V30.6666H44V44H4V4Z" fill="currentColor"></path>
              </svg>
            </div>
            <h2 className="text-white text-lg font-bold leading-tight tracking-[-0.015em]">Coffee Corner</h2>
          </div>
          <div className="flex flex-1 justify-end gap-8">
            <div className="flex items-center gap-9">
              <a className="text-white text-sm font-medium leading-normal" href="#">Menu</a>
              <a className="text-white text-sm font-medium leading-normal" href="#">About Us</a>
              <a className="text-white text-sm font-medium leading-normal" href="#">Location & Hours</a>
              <a className="text-white text-sm font-medium leading-normal" href="#">Contact</a>
            </div>
            <button
              className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#d46c11] text-white text-sm font-bold leading-normal tracking-[0.015em]"
            >
              <span className="truncate">Order Online</span>
            </button>
          </div>
        </header>
        <div className="px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            <div className="@container">
              <div className="@[480px]:p-4">
                <div
                  className="flex min-h-[480px] flex-col gap-6 bg-cover bg-center bg-no-repeat @[480px]:gap-8 @[480px]:rounded-lg items-center justify-center p-4"
                  style={{ backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.4) 100%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuAWrcTFsTjykeJ4ZLzXRE72er6FE-C2qxLui6im-rWb-Jl0tR3PdUOlwQgYyKNrWAVZfdcqAUUuxILraRsG20X24kg9f3gUVdNFF9A-__R23iyC45SSlDJ1Fyne21C6Svhe3JIci4v5lx47sMYOyh1VPDTFytrg1f9-n2OBXYkXZXW3NyaojP5BZfSgiGm7YPxiFyojqB2TQgFriVpWGxuTS2_PQeBwyfSHTSizHb2tT6fL_O8LbnKMTbUeog5kKWdgMpNb9oELQg")' }}
                >
                  <div className="flex flex-col gap-2 text-center">
                    <h1
                      className="text-white text-4xl font-black leading-tight tracking-[-0.033em] @[480px]:text-5xl @[480px]:font-black @[480px]:leading-tight @[480px]:tracking-[-0.033em]"
                    >
                      Welcome to Coffee Corner
                    </h1>
                    <h2 className="text-white text-sm font-normal leading-normal @[480px]:text-base @[480px]:font-normal @[480px]:leading-normal">
                      Your neighborhood spot for the finest coffee and pastries. Experience the warmth and aroma of freshly brewed coffee in a cozy atmosphere.
                    </h2>
                  </div>
                  <button
                    className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 @[480px]:h-12 @[480px]:px-5 bg-[#d46c11] text-white text-sm font-bold leading-normal tracking-[0.015em] @[480px]:text-base @[480px]:font-bold @[480px]:leading-normal @[480px]:tracking-[0.015em]"
                  >
                    <span className="truncate">View Menu</span>
                  </button>
                </div>
              </div>
            </div>
            <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Our Story</h2>
            <p className="text-white text-base font-normal leading-normal pb-3 pt-1 px-4">
              Established in 2010, Coffee Corner has been a beloved gathering place for coffee enthusiasts and casual visitors alike. Our passion for quality coffee and friendly
              service has made us a local favorite. We source our beans from the best farms around the world, ensuring every cup is a delightful experience.
            </p>
            <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Featured Items</h2>
            <div className="flex overflow-y-auto [-ms-scrollbar-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <div className="flex items-stretch p-4 gap-3">
                <div className="flex h-full flex-1 flex-col gap-4 rounded-lg min-w-60">
                  <div
                    className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-lg flex flex-col"
                    style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAVLNwf_Ogprk79wgV531iMetUDm_m4fB_lXCjRfu8ffZm1EoBEofOZ6AWqNqM6OjrxZjvbRq2QvsaL8WQ_igxkMzpWavc1TuJ_x-dlsNGk4cw8Sf4LjzLcaHJ3X5tJbYevVNX8q_BwfCAIw1yjY4WB2BMepP_oqizkLnrQiosk-dpfj5e0zIlTH4umW8XjKe369qIezbTPx4gLYw51oymYAC3bSb3FKr9saEKB4eRjZxlEMN-R8TmOrF5D_-4eCSEPE1Pna9wKdg")' }}
                  ></div>
                  <div>
                    <p className="text-white text-base font-medium leading-normal">Signature Latte</p>
                    <p className="text-[#c9ac92] text-sm font-normal leading-normal">Our signature latte with a unique blend of espresso and steamed milk.</p>
                  </div>
                </div>
                <div className="flex h-full flex-1 flex-col gap-4 rounded-lg min-w-60">
                  <div
                    className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-lg flex flex-col"
                    style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAh58CQgJ7PiBPBQScFsvcIf0a1dnmQwGl4fDTRBa2DpEcnx4rhMc87-uUY1ri_3XPu_zetEuKiQR3vACET3Dh6b0BAI2pzKawkbg_FYAwdFKr6jVbNLfp5SWS34skKecChKeUI42_KLVSp-ociVN5nymrleY00DOfpA0sHoAI2ZFCOdfSnjQ4dLGGc7fmVd4Jushp1oL5PnNQppsLeOEHnKbyZ9EsDvdVAipX9oxy4IPeaIIh1rMhRGsfEE_Z3H7QGThS621L4YQ")' }}
                  ></div>
                  <div>
                    <p className="text-white text-base font-medium leading-normal">Freshly Baked Croissant</p>
                    <p className="text-[#c9ac92] text-sm font-normal leading-normal">Flaky and buttery croissants baked fresh daily.</p>
                  </div>
                </div>
                <div className="flex h-full flex-1 flex-col gap-4 rounded-lg min-w-60">
                  <div
                    className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-lg flex flex-col"
                    style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAxm0KwUVKNX49NuTZbb5A5SObeBsyMDUSQi_Bv5NeCoNIbnDK1RmtiaS2LODdlq0NyP47njPcpuQkZpIMXi93XZ8zq0scyaF0b9qGcKN21KwRIknzPevkPYAagNQrmD-hf6L6l740DAIrb77xVKSYTa1cCu56bvfbo9agQkvoPrN1s9DKd-u-rMsgK70-Y-KgjpVO4mEgGSTefaIMOyxLobM12qXKvpxa001IhK2LkcH8duR9QluR1A4jC3Z_4IoZBTV8m5V6R2g")' }}
                  ></div>
                  <div>
                    <p className="text-white text-base font-medium leading-normal">Iced Coffee</p>
                    <p className="text-[#c9ac92] text-sm font-normal leading-normal">Refreshing iced coffee, perfect for a warm day.</p>
                  </div>
                </div>
              </div>
            </div>
            <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Gallery</h2>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(158px,1fr))] gap-3 p-4">
              <div className="flex flex-col gap-3">
                <div
                  className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-lg"
                  style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDVRN9JOBAr6gunEvDXTkomTPc71C-ySnFWcB2uk5IiGg3QErilbTrOJlKBrE8Jdz6xFc1ACmNfxmREwBibjTnOslhMGt8nK1TALYNTb2XhMAIs48e5PlOp05UPT9GjLKcV7G2y3s0fYHl7xBIgI4EnHf3LnS-RAULNH8p3SnQhTTuFwv-y2GlNC-P8N_kMTqQcua46xHZdDKRqsb0OhhxGYDrRBd9DusQVT-k3liKMe8yyKWbd9DpppoxJ1WqE6IYHQ08StiMDvw")' }}
                ></div>
              </div>
              <div className="flex flex-col gap-3">
                <div
                  className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-lg"
                  style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDoRZcOonJqyETB0jVryYr-i2zHWg6GpINStIu0Z_0rhjZCXzSulTfy7_1UsCppKn-suPf3u7amCrjOso4h7a-o5MW5QggR0TfvcrBtiRqCjReTtrw63TKK55NnGVIlzKQh-FNMEIAzzPpbE3F1tKbhs0blm8XKU3_InMCbF63IApiYkXZRVO3BAw45aaoJIWGQi32esJoDKbmOrNlTjBhLfY1Z1i9d4QehF2C24x5F68zhtAI5PneKaKoTM7QSDUQo-wyvpq9Llw")' }}
                ></div>
              </div>
              <div className="flex flex-col gap-3">
                <div
                  className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-lg"
                  style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAhb0_xi5dJ9wxPTU23ChbzETs0J_ZA3Tl6Bp6LtsvCgywpo-y5gBxHUNxmQiF96oO1DyEWGZFpFIa2SB0oZg6dWXIcpXdg-dqIWgKBLqG-FY1KjosRFtn_bvUtEIB1XyY-J2kTxrQab88RQFX-oVz2VVZIsna60VxgbOzPmQ0pBWYTa1GvfrIrQbS9yVcIRPnCfXttnXievORA8EPBqonFVK9D36k7D2GwpLlT3iEm_4GAL59iwts2F7GGBx76fdkc_H8roBXoCA")' }}
                ></div>
              </div>
              <div className="flex flex-col gap-3">
                <div
                  className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-lg"
                  style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBIGMXTeC1SaVcx4MsH9LX9fKYJu_DbtNj_P-Vr-JFptnS-6TahsAT-73Nrb2Jr5DLWCbrrx1ohvnWQduxNH9UqmRUm6zy2eSRjgY6SyyG27rI8Q8QrlU1VWuaTvoNuh5Tw1olEPDN_RbZyaWn6_SV0wmA-jNMODo3XQ3cOBlt1IdN_pRSOz1_Z4Z6m0STCdjDp8tgZOFPzflSDMG8PmmmO3lUI6hBSgCVA8eD0BEef8YIkMwxUEW3_4oeevtPXqjhvKek5hVfv-g")' }}
                ></div>
              </div>
              <div className="flex flex-col gap-3">
                <div
                  className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-lg"
                  style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuARpeiBX_nxQjbYA80q3OSbcGPkCaO_M2N43i8yDclT1BP9wyvOwX_kvu3tRbBi-QCBKuO1Gt-odqNZAiRaTCUX_gyGVe6eVnI6VVwooCt1NW7rhcXt7fAOl530hGnSFTnPDrp7i9bdSxhygcflrdAmCY41Ui02tVrBl5o1eTUwV82s4Sp1Xg1JYqAyX9n3qSVpagcMeP-EVPUU_7PaVd718Pi2UXrwCdHd0-1OqJtJqCs6OFmfls_ucTeKMzIuPc--SEg_OHMLdQ")' }}
                ></div>
              </div>
              <div className="flex flex-col gap-3">
                <div
                  className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-lg"
                  style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCsIjUv04QqesB9nnoxLF2s93JFiwR_rafFQFLtwCBXcMll0_Sucz1qTh0ikMkXHNVU3tmQy3JnkDxYtCf-M7isz9Wb4eqNTpeUaqzFCxIU1Wi5Q5gk53IyWzQE3UGfemBIXZD8jEqMHzFIoR1od2PJd6KNMy0SyXYHQ4vWteeLFQWhvAUdVJqbrH0m4chnM1mMraRib4hS7kaVo_2Q8cT3d6licSJ9bLbyRVt2IezdhNN6puXHQgvMageGp9rvAs633yYG8V7vBA")' }}
                ></div>
              </div>
            </div>
            <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Menu</h2>
            <div className="px-4 py-3 @container">
              <div className="flex overflow-hidden rounded-lg border border-[#674b32] bg-[#221911]">
                <table className="flex-1">
                  <thead>
                    <tr className="bg-[#332519]">
                      <th className="table-519a83ba-4ba4-47ca-ad0d-f883926746bb-column-120 px-4 py-3 text-left text-white w-[400px] text-sm font-medium leading-normal">Item</th>
                      <th className="table-519a83ba-4ba4-47ca-ad0d-f883926746bb-column-240 px-4 py-3 text-left text-white w-[400px] text-sm font-medium leading-normal">Description</th>
                      <th className="table-519a83ba-4ba4-47ca-ad0d-f883926746bb-column-360 px-4 py-3 text-left text-white w-[400px] text-sm font-medium leading-normal">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t border-t-[#674b32]">
                      <td className="table-519a83ba-4ba4-47ca-ad0d-f883926746bb-column-120 h-[72px] px-4 py-2 w-[400px] text-white text-sm font-normal leading-normal">Espresso</td>
                      <td className="table-519a83ba-4ba4-47ca-ad0d-f883926746bb-column-240 h-[72px] px-4 py-2 w-[400px] text-[#c9ac92] text-sm font-normal leading-normal">
                        Strong and concentrated coffee brewed by forcing hot water through finely-ground coffee beans.
                      </td>
                      <td className="table-519a83ba-4ba4-47ca-ad0d-f883926746bb-column-360 h-[72px] px-4 py-2 w-[400px] text-[#c9ac92] text-sm font-normal leading-normal">$2.50</td>
                    </tr>
                    <tr className="border-t border-t-[#674b32]">
                      <td className="table-519a83ba-4ba4-47ca-ad0d-f883926746bb-column-120 h-[72px] px-4 py-2 w-[400px] text-white text-sm font-normal leading-normal">Cappuccino</td>
                      <td className="table-519a83ba-4ba4-47ca-ad0d-f883926746bb-column-240 h-[72px] px-4 py-2 w-[400px] text-[#c9ac92] text-sm font-normal leading-normal">
                        Espresso with steamed milk and a layer of foamed milk.
                      </td>
                      <td className="table-519a83ba-4ba4-47ca-ad0d-f883926746bb-column-360 h-[72px] px-4 py-2 w-[400px] text-[#c9ac92] text-sm font-normal leading-normal">$3.50</td>
                    </tr>
                    <tr className="border-t border-t-[#674b32]">
                      <td className="table-519a83ba-4ba4-47ca-ad0d-f883926746bb-column-120 h-[72px] px-4 py-2 w-[400px] text-white text-sm font-normal leading-normal">Latte</td>
                      <td className="table-519a83ba-4ba4-47ca-ad0d-f883926746bb-column-240 h-[72px] px-4 py-2 w-[400px] text-[#c9ac92] text-sm font-normal leading-normal">
                        Espresso with steamed milk and a thin layer of foam.
                      </td>
                      <td className="table-519a83ba-4ba4-47ca-ad0d-f883926746bb-column-360 h-[72px] px-4 py-2 w-[400px] text-[#c9ac92] text-sm font-normal leading-normal">$4.00</td>
                    </tr>
                    <tr className="border-t border-t-[#674b32]">
                      <td className="table-519a83ba-4ba4-47ca-ad0d-f883926746bb-column-120 h-[72px] px-4 py-2 w-[400px] text-white text-sm font-normal leading-normal">Iced Coffee</td>
                      <td className="table-519a83ba-4ba4-47ca-ad0d-f883926746bb-column-240 h-[72px] px-4 py-2 w-[400px] text-[#c9ac92] text-sm font-normal leading-normal">
                        Chilled coffee served over ice.
                      </td>
                      <td className="table-519a83ba-4ba4-47ca-ad0d-f883926746bb-column-360 h-[72px] px-4 py-2 w-[400px] text-[#c9ac92] text-sm font-normal leading-normal">$3.00</td>
                    </tr>
                    <tr className="border-t border-t-[#674b32]">
                      <td className="table-519a83ba-4ba4-47ca-ad0d-f883926746bb-column-120 h-[72px] px-4 py-2 w-[400px] text-white text-sm font-normal leading-normal">Pastry</td>
                      <td className="table-519a83ba-4ba4-47ca-ad0d-f883926746bb-column-240 h-[72px] px-4 py-2 w-[400px] text-[#c9ac92] text-sm font-normal leading-normal">
                        Freshly baked pastry of the day.
                      </td>
                      <td className="table-519a83ba-4ba4-47ca-ad0d-f883926746bb-column-360 h-[72px] px-4 py-2 w-[400px] text-[#c9ac92] text-sm font-normal leading-normal">$2.00</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
            </div>
            <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Location & Hours</h2>
            <div className="flex px-4 py-3">
              <div
                className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-lg object-cover"
                style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDNASFpVA7gAYyLiXHRMq4fRYS7ROwekzD3vmcdxbdNgw6gc7H-wiPOHP5P8qO4Qr3gqCcSLD3re9Zo34mnejXUHX5V75aLGy-cQUHEs_aScEpDhQ-5CZ1-QuZuejz3gEpkOHd6azin_yeBBE7YIX4Wfl_-N2UGkhTcQx39WnKp_nY03YDaYNaW2knbShMb5WbEsmhA36fgLeWT6Zj6SNx72vCvZ3BtmHiKuXOopTKfoxJt5Q3Jaww0SKgdA3m_7QPFrcfgLqrnjg")' }}
              ></div>
            </div>
            <p className="text-white text-base font-normal leading-normal pb-3 pt-1 px-4">123 Main Street, Anytown, USA Monday - Friday: 7 AM - 7 PM Saturday - Sunday: 8 AM - 5 PM</p>
          </div>
        </div>
        <footer className="flex justify-center">
          <div className="flex max-w-[960px] flex-1 flex-col">
            <footer className="flex flex-col gap-6 px-5 py-10 text-center @container">
              <div className="flex flex-wrap items-center justify-center gap-6 @[480px]:flex-row @[480px]:justify-around">
                <a className="text-[#c9ac92] text-base font-normal leading-normal min-w-40" href="#">Privacy Policy</a>
                <a className="text-[#c9ac92] text-base font-normal leading-normal min-w-40" href="#">Terms of Service</a>
                <a className="text-[#c9ac92] text-base font-normal leading-normal min-w-40" href="#">Contact Us</a>
              </div>
              <div className="flex flex-wrap justify-center gap-4">
                <a href="#">
                  <div className="text-[#c9ac92]" data-icon="InstagramLogo" data-size="24px" data-weight="regular">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                      <path
                        d="M128,80a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160ZM176,24H80A56.06,56.06,0,0,0,24,80v96a56.06,56.06,0,0,0,56,56h96a56.06,56.06,0,0,0,56-56V80A56.06,56.06,0,0,0,176,24Zm40,152a40,40,0,0,1-40,40H80a40,40,0,0,1-40-40V80A40,40,0,0,1,80,40h96a40,40,0,0,1,40,40ZM192,76a12,12,0,1,1-12-12A12,12,0,0,1,192,76Z"
                      ></path>
                    </svg>
                  </div>
                </a>
                <a href="#">
                  <div className="text-[#c9ac92]" data-icon="FacebookLogo" data-size="24px" data-weight="regular">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                      <path
                        d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm8,191.63V152h24a8,8,0,0,0,0-16H136V112a16,16,0,0,1,16-16h16a8,8,0,0,0,0-16H152a32,32,0,0,0-32,32v24H96a8,8,0,0,0,0,16h24v63.63a88,88,0,1,1,16,0Z"
                      ></path>
                    </svg>
                  </div>
                </a>
                <a href="#">
                  <div className="text-[#c9ac92]" data-icon="TwitterLogo" data-size="24px" data-weight="regular">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                      <path
                        d="M247.39,68.94A8,8,0,0,0,240,64H209.57A48.66,48.66,0,0,0,168.1,40a46.91,46.91,0,0,0-33.75,13.7A47.9,47.9,0,0,0,120,88v6.09C79.74,83.47,46.81,50.72,46.46,50.37a8,8,0,0,0-13.65,4.92c-4.31,47.79,9.57,79.77,22,98.18a110.93,110.93,0,0,0,21.88,24.2c-15.23,17.53-39.21,26.74-39.47,26.84a8,8,0,0,0-3.85,11.93c.75,1.12,3.75,5.05,11.08,8.72C53.51,229.7,65.48,232,80,232c70.67,0,129.72-54.42,135.75-124.44l29.91-29.9A8,8,0,0,0,247.39,68.94Zm-45,29.41a8,8,0,0,0-2.32,5.14C196,166.58,143.28,216,80,216c-10.56,0-18-1.4-23.22-3.08,11.51-6.25,27.56-17,37.88-32.48A8,8,0,0,0,92,169.08c-.47-.27-43.91-26.34-44-96,16,13,45.25,33.17,78.67,38.79A8,8,0,0,0,136,104V88a32,32,0,0,1,9.6-22.92A30.94,30.94,0,0,1,167.9,56c12.66.16,24.49,7.88,29.44,19.21A8,8,0,0,0,204.67,80h16Z"
                      ></path>
                    </svg>
                  </div>
                </a>
              </div>
              <p className="text-[#c9ac92] text-base font-normal leading-normal">@2024 Coffee Corner. All rights reserved.</p>
            </footer>
          </div>
        </footer>
      </div>
    </div>

	)
  
}

export default App
