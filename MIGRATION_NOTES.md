# Contract Migration Notes

## Recent Contract Updates

The BTC University smart contract has been updated with several important fixes:

### Key Changes

1. **Fixed enrollment tracking**: Now uses only the `enrollments` map consistently

   - Previous contract had a bug where `enroll-course` wrote to `student-courses` but `is-enrolled` checked `enrollments`
   - New contract fixed: `enroll-course` and `is-enrolled` both use `enrollments` map

2. **New batch functions**:
   - `get-enrolled-ids(principal)`: Returns list of all course IDs a student is enrolled in
   - `get-all-courses()`: Returns list of all available courses
3. **Updated sBTC token address**:

   - Old: `ST28XHPFNX4YQV09EZRJSF1AC7KKKDJPDR4EQ8DEJ.sbtc-token` (custom test token)
   - New: `ST1F7QA2MDF17S807EPA36TSS8AMEFY4KA9TVGWXT.sbtc-token` (official testnet sBTC)

4. **Simplified whitelist requirement**:

   - Old: Required minimum USD value calculation using DIA oracle
   - New: Simple sBTC balance check (0.001 BTC = 100,000 satoshis)

5. **Fixed instructor claim function**:
   - Now properly uses `as-contract` to transfer from contract escrow

### Frontend Updates Required

✅ **Updated `check-enrollment` API** - Reverted to use `is-enrolled` read-only function
✅ **Added `get-enrolled-ids` API** - New batch endpoint for efficient enrollment checking  
✅ **Updated course enrollment component** - Now uses batch API instead of checking each course individually
✅ **Updated environment variable docs** - New sBTC contract address

### Environment Variable Changes

Update your `.env.local`:

```bash
# Change this:
NEXT_PUBLIC_SBTC_CONTRACT_ADDRESS=ST28XHPFNX4YQV09EZRJSF1AC7KKKDJPDR4EQ8DEJ

# To this:
NEXT_PUBLIC_SBTC_CONTRACT_ADDRESS=ST1F7QA2MDF17S807EPA36TSS8AMEFY4KA9TVGWXT
```

### Testing Checklist

- [ ] Whitelist enrollment works with new sBTC balance check
- [ ] Course enrollment creates entry in `enrollments` map
- [ ] `get-enrolled-ids` returns correct course IDs
- [ ] UI shows "Enrolled ✓" and "View Course" for enrolled courses
- [ ] sBTC balance displays correctly on dashboard
- [ ] Instructor can claim course fees

### Known Issues Resolved

- ❌ **OLD**: False negative enrollment checks (contract map mismatch)
- ✅ **FIXED**: Enrollment status now correctly detected
- ❌ **OLD**: ERR-NOT-ENOUGH-SBTC on whitelist enrollment (oracle/contract mismatch)
- ✅ **FIXED**: Simple satoshi balance check, no oracle needed for whitelist
