import type {
  Contract,
  ContractFinancials,
  ContractHistoryLog,
  ContractOwner,
  ContractParty,
  ContractPartyResourceDto,
  ContractProperty,
  ContractResourceDto,
  ContractStatus,
  ContractType,
  EjarIntegrationInfo,
  InstallmentItem,
  PaymentFrequency,
  PaymentStatus,
} from "../types";
import { CONTRACT_STATUS_OPTIONS } from "../constants";

function parseType(typeStr?: string): {
  type: ContractType;
  typeLabel: string;
} {
  if (!typeStr) return { type: "residential", typeLabel: "عقد سكني" };
  const lower = typeStr.toLowerCase();
  if (lower.includes("commercial") || lower.includes("تجار")) {
    return { type: "commercial", typeLabel: "عقد تجاري" };
  }
  return { type: "residential", typeLabel: "عقد سكني" };
}

function parseStatus(statusStr?: string): {
  status: ContractStatus;
  statusLabel: string;
  statusColorClass: string;
  statusVariant: "default" | "secondary" | "outline" | "destructive" | "ghost";
} {
  if (!statusStr) {
    return {
      status: "under_review",
      statusLabel: "قيد المراجعة والتدقيق",
      statusColorClass: CONTRACT_STATUS_OPTIONS[1].badgeClass,
      statusVariant: "default",
    };
  }

  const s = statusStr.toLowerCase();

  if (
    s.includes("certified") ||
    s.includes("موثق") ||
    s.includes("نشط") ||
    s.includes("active")
  ) {
    return {
      status: "certified",
      statusLabel: "موثق مع إيجار",
      statusColorClass: CONTRACT_STATUS_OPTIONS[0].badgeClass,
      statusVariant: "outline",
    };
  }
  if (
    s.includes("under_review") ||
    s.includes("مراجعة") ||
    s.includes("تدقيق")
  ) {
    return {
      status: "under_review",
      statusLabel: "قيد المراجعة والتدقيق",
      statusColorClass: CONTRACT_STATUS_OPTIONS[1].badgeClass,
      statusVariant: "default",
    };
  }
  if (s.includes("pending_approval") || s.includes("موافقة")) {
    return {
      status: "pending_approval",
      statusLabel: "بانتظار موافقة الأطراف",
      statusColorClass: CONTRACT_STATUS_OPTIONS[2].badgeClass,
      statusVariant: "secondary",
    };
  }
  if (
    s.includes("pending_payment") ||
    s.includes("دفع") ||
    s.includes("سداد") ||
    s.includes("مسودة") ||
    s.includes("draft")
  ) {
    return {
      status: "pending_payment",
      statusLabel:
        s.includes("مسودة") || s.includes("draft") ? "مسودة" : "بانتظار السداد",
      statusColorClass: CONTRACT_STATUS_OPTIONS[3].badgeClass,
      statusVariant: "outline",
    };
  }
  if (s.includes("rejected") || s.includes("مرفوض")) {
    return {
      status: "rejected",
      statusLabel: "مرفوض من إيجار",
      statusColorClass: CONTRACT_STATUS_OPTIONS[4].badgeClass,
      statusVariant: "destructive",
    };
  }
  if (s.includes("expired") || s.includes("منتهي")) {
    return {
      status: "expired",
      statusLabel: "منتهي الصلاحية",
      statusColorClass: CONTRACT_STATUS_OPTIONS[5].badgeClass,
      statusVariant: "outline",
    };
  }
  if (s.includes("cancelled") || s.includes("ملغي")) {
    return {
      status: "cancelled",
      statusLabel: "ملغي",
      statusColorClass: CONTRACT_STATUS_OPTIONS[6].badgeClass,
      statusVariant: "destructive",
    };
  }

  return {
    status: "under_review",
    statusLabel: statusStr,
    statusColorClass: CONTRACT_STATUS_OPTIONS[1].badgeClass,
    statusVariant: "default",
  };
}

function parsePaymentFrequency(freqStr?: string): {
  paymentFrequency: PaymentFrequency;
  paymentFrequencyLabel: string;
} {
  if (!freqStr)
    return {
      paymentFrequency: "annual",
      paymentFrequencyLabel: "سنوي (دفعة واحدة)",
    };
  const lower = freqStr.toLowerCase();
  if (lower.includes("month") || lower.includes("شهر")) {
    return {
      paymentFrequency: "monthly",
      paymentFrequencyLabel: "شهري (12 دفعة)",
    };
  }
  if (lower.includes("quarter") || lower.includes("ربع")) {
    return {
      paymentFrequency: "quarterly",
      paymentFrequencyLabel: "ربع سنوي (4 دفعات)",
    };
  }
  if (lower.includes("semi") || lower.includes("نصف")) {
    return {
      paymentFrequency: "semi_annual",
      paymentFrequencyLabel: "نصف سنوي (دفعتان)",
    };
  }
  return {
    paymentFrequency: "annual",
    paymentFrequencyLabel: "سنوي (دفعة واحدة)",
  };
}

function mapParty(
  partyDto?: ContractPartyResourceDto | null,
  fallbackRole: "lessor" | "lessee" | "broker" = "lessor",
): ContractParty {
  if (!partyDto) {
    const isLessor = fallbackRole === "lessor";
    return {
      name: isLessor
        ? "المؤجر"
        : fallbackRole === "lessee"
          ? "المستأجر"
          : "الوسيط",
      role: fallbackRole,
      idType: "national_id",
      idTypeLabel: "هوية وطنية",
      idNumber: "—",
      phone: "—",
      email: "—",
      verifiedViaNafath: false,
      citizenAccountEligible: !isLessor,
      socialInsuranceEligible: !isLessor,
    };
  }

  const roleLower = (partyDto.role || "").toLowerCase();
  let role: "lessor" | "lessee" | "broker" = fallbackRole;
  if (
    roleLower.includes("tenant") ||
    roleLower.includes("lessee") ||
    roleLower.includes("مستأجر")
  ) {
    role = "lessee";
  } else if (roleLower.includes("broker") || roleLower.includes("وسيط")) {
    role = "broker";
  } else if (
    roleLower.includes("landlord") ||
    roleLower.includes("lessor") ||
    roleLower.includes("مؤجر")
  ) {
    role = "lessor";
  }

  const isCompany =
    partyDto.entityType === "company" ||
    Boolean(partyDto.crNumber || partyDto.unifiedNumber);

  return {
    name:
      partyDto.name ||
      (role === "lessor"
        ? "المؤجر"
        : role === "lessee"
          ? "المستأجر"
          : "الوسيط"),
    role,
    idType: isCompany ? "cr" : "national_id",
    idTypeLabel: isCompany ? "سجل تجاري" : "هوية وطنية",
    idNumber:
      partyDto.nationalId || partyDto.crNumber || partyDto.unifiedNumber || "—",
    phone: partyDto.phone || partyDto.companyPhone || "—",
    email: partyDto.email || "—",
    iban: partyDto.iban || undefined,
    bankName: partyDto.bankName || undefined,
    birthDate: partyDto.dateOfBirth || undefined,
    crNumber: partyDto.crNumber || undefined,
    valLicenseNumber: partyDto.valLicenseNumber || undefined,
    representationType: partyDto.representationType as any,
    representationTypeLabel: partyDto.representationType
      ? "وكيل شرعي معتمد"
      : "أصيل (المالك)",
    powerOfAttorneyNumber: partyDto.powerOfAttorneyNumber || undefined,
    powerOfAttorneyDate: partyDto.powerOfAttorneyEndDate || undefined,
    verifiedViaNafath: partyDto.verifiedViaNafath ?? true,
    citizenAccountEligible: role === "lessee",
    socialInsuranceEligible: role === "lessee",
  };
}

export function mapContractDtoToViewModel(dto: ContractResourceDto): Contract {
  const { type, typeLabel } = parseType(dto.contractType);
  const { status, statusLabel, statusColorClass, statusVariant } = parseStatus(
    dto.status,
  );
  const { paymentFrequency, paymentFrequencyLabel } = parsePaymentFrequency(
    dto.terms?.paymentFrequency,
  );

  // Find parties
  const parties = dto.parties || [];
  const lessorDto =
    parties.find((p) => {
      const r = (p.role || "").toLowerCase();
      return (
        r.includes("landlord") || r.includes("lessor") || r.includes("مؤجر")
      );
    }) || parties[0];

  const lesseeDto =
    parties.find((p) => {
      const r = (p.role || "").toLowerCase();
      return (
        r.includes("tenant") || r.includes("lessee") || r.includes("مستأجر")
      );
    }) || (parties.length > 1 ? parties[1] : null);

  const brokerDto = parties.find((p) => {
    const r = (p.role || "").toLowerCase();
    return r.includes("broker") || r.includes("وسيط");
  });

  const lessor = mapParty(lessorDto, "lessor");
  const lessee = mapParty(lesseeDto, "lessee");
  const broker = brokerDto ? mapParty(brokerDto, "broker") : undefined;

  // Property & Unit
  const prop = dto.property?.property;
  const unit = dto.property?.unit;

  const property: ContractProperty = {
    name:
      prop?.district && prop?.city
        ? `عقار ${prop.city} - ${prop.district}`
        : prop?.district ||
          prop?.city ||
          (type === "residential" ? "وحدة سكنية" : "وحدة تجارية"),
    type: (unit?.unitType?.toLowerCase().includes("شقة")
      ? "apartment"
      : unit?.unitType?.toLowerCase().includes("فيلا")
        ? "villa"
        : unit?.unitType?.toLowerCase().includes("مكتب")
          ? "office"
          : unit?.unitType?.toLowerCase().includes("محل")
            ? "shop"
            : type === "residential"
              ? "apartment"
              : "office") as any,
    typeLabel:
      unit?.unitType || (type === "residential" ? "شقة سكنية" : "مكتب تجاري"),
    deedNumber: prop?.deedNumber || "—",
    deedDate: prop?.gregorianDate || prop?.hijriDate || "—",
    unitNumber: unit?.unitNumber ? `وحدة رقم ${unit.unitNumber}` : "—",
    areaSqm: Number(unit?.area) || 0,
    roomsCount: unit?.roomsCount,
    bathroomsCount: unit?.bathroomsCount,
    floorsCount: unit?.floorsCount,
    floorNumber: unit?.floor || "—",
    furnishingStatus: (unit?.furnishingStatus as any) || "unfurnished",
    furnishingStatusLabel:
      unit?.furnishingStatus === "fully_furnished"
        ? "مفروشة بالكامل"
        : "غير مفروشة",
    hasElevator: unit?.hasElevator ?? false,
    hasParking: unit?.hasParking ?? false,
    hasCentralAC: unit?.hasCentralAC ?? false,
    city: prop?.city || "—",
    district: prop?.district || "—",
    street: prop?.street || "—",
    postalCode: prop?.postalCode || "—",
    buildingNumber: prop?.buildingNumber || "—",
    additionalNumber: prop?.additionalNumber || "—",
    electricityMeterNumber: unit?.electricityMeter || "—",
    waterMeterNumber: unit?.waterMeter || "—",
    gasMeterNumber: unit?.gasMeter,
  };

  // Financials & Payments
  const rentalAmount = Number(
    dto.terms?.annualRent || dto.financial?.annualRent || 0,
  );
  const platformFee = Number(
    dto.financial?.documentationFee?.amount ||
      dto.financial?.serviceFeeNet ||
      0,
  );
  const taxAmount = Number(
    dto.financial?.documentationFee?.taxAmount || dto.financial?.taxAmount || 0,
  );
  const securityDeposit = 0;

  const isPaid =
    status === "certified" ||
    Boolean(
      dto.payments &&
      dto.payments.length > 0 &&
      dto.payments.some((p) => p.status === "paid"),
    );

  const paymentStatus: PaymentStatus = isPaid ? "paid" : "unpaid";
  const paymentStatusLabel = isPaid ? "مدفوع بالكامل" : "غير مدفوع";

  const installments: InstallmentItem[] =
    dto.payments && dto.payments.length > 0
      ? dto.payments.map((p, idx) => ({
          id: String(p.id || `inst-${idx + 1}`),
          number: p.number || idx + 1,
          dueDate: p.dueDate || "—",
          amount: Number(p.amount) || rentalAmount,
          amountFormatted: `${Number(p.amount || rentalAmount).toLocaleString("en-US")} ر.س`,
          status: p.status === "paid" ? "paid" : "pending",
          statusLabel: p.status === "paid" ? "تم السداد" : "بانتظار السداد",
          paidDate: p.paidDate,
          paymentMethod: p.paymentMethod,
        }))
      : rentalAmount > 0
        ? [
            {
              id: `inst-1`,
              number: 1,
              dueDate:
                dto.terms?.startDate || dto.createdAt?.slice(0, 10) || "—",
              amount: rentalAmount,
              amountFormatted: `${rentalAmount.toLocaleString("en-US")} ر.س`,
              status: isPaid ? "paid" : "pending",
              statusLabel: isPaid ? "تم السداد" : "بانتظار السداد",
              paidDate: isPaid ? dto.createdAt?.slice(0, 10) : undefined,
            },
          ]
        : [];

  const financials: ContractFinancials = {
    rentalAmount,
    rentalAmountFormatted: `${rentalAmount.toLocaleString("en-US")} ر.س`,
    securityDeposit,
    securityDepositFormatted: `${securityDeposit.toLocaleString("en-US")} ر.س`,
    platformFee,
    platformFeeFormatted: `${platformFee.toLocaleString("en-US")} ر.س`,
    taxAmount,
    taxAmountFormatted: `${taxAmount.toLocaleString("en-US")} ر.س`,
    totalPaid: isPaid ? platformFee + taxAmount : 0,
    paymentFrequency,
    paymentFrequencyLabel,
    paymentStatus,
    paymentStatusLabel,
    paymentMethod: isPaid ? "mada" : undefined,
    paymentMethodLabel: isPaid ? "مدى (Mada)" : undefined,
    transactionId: undefined,
    paidAt: isPaid ? dto.createdAt : undefined,
    installments,
  };

  // Ejar integration info
  const ejarContractNum = dto.ejarContractNumber || dto.ejarNumber || "";

  const ejar: EjarIntegrationInfo = {
    ejarContractNumber: ejarContractNum,
    ejarStatus:
      status === "certified"
        ? "synced_active"
        : status === "pending_approval"
          ? "approval_waiting"
          : "pending_sync",
    ejarStatusLabel:
      status === "certified"
        ? "متزامن ونشط في شبكة إيجار"
        : status === "pending_approval"
          ? "بانتظار الموافقة في إيجار"
          : "قيد المزامنة والإرسال",
    ejarSyncedAt:
      status === "certified" ? dto.updatedAt || dto.createdAt : undefined,
    regaLicenseNumber: "—",
    verificationQrUrl: ejarContractNum
      ? `https://ejar.sa/ar/contracts/verify?number=${ejarContractNum}`
      : "https://ejar.sa/ar/contracts/verify",
    electronicSeals: {
      rega: status === "certified",
      ejar: status === "certified",
      saudiBusinessCenter: status === "certified",
    },
  };

  // Duration
  const isYearly =
    dto.terms?.durationUnit === "years" ||
    Boolean(
      dto.terms?.durationUnit &&
      (dto.terms.durationUnit.includes("سنو") ||
        dto.terms.durationUnit.includes("سنة")),
    );

  const durationMonths = isYearly
    ? (dto.terms?.durationValue || 1) * 12
    : dto.terms?.durationValue || 12;

  // History logs
  const historyLogs: ContractHistoryLog[] =
    dto.statusHistory && dto.statusHistory.length > 0
      ? dto.statusHistory.map((h, i) => ({
          id: String(h.id || `log-${i}`),
          timestamp: h.createdAt || dto.createdAt || "—",
          action: h.status ? `تحديث الحالة إلى ${h.status}` : "تحديث سجل العقد",
          performedBy: h.createdByName || "النظام الآلي",
          note: h.notes,
        }))
      : [
          {
            id: `log-init-${dto.id}`,
            timestamp: dto.createdAt || "—",
            action: "إنشاء مسودة العقد وتعبئة البيانات",
            performedBy: lessor.name || "المستخدم",
            note: "تم إنشاء العقد عبر منصة مكفي وموفي وتجهيز مسودة التوثيق.",
          },
        ];

  // Owner (only set role/roleLabel if returned from the API)
  const creatorParty = parties.find(
    (p) =>
      (dto.createdBy != null &&
        (p.userId === dto.createdBy || p.id === dto.createdBy)) ||
      Boolean((p as { isCreator?: boolean })?.isCreator),
  );

  let ownerRole: ContractOwner["role"] | undefined;
  let ownerRoleLabel: string | undefined;

  const rawRole =
    creatorParty?.role ||
    (dto as { creatorRole?: string; createdByRole?: string }).creatorRole ||
    (dto as { creatorRole?: string; createdByRole?: string }).createdByRole;

  if (rawRole) {
    const roleLower = rawRole.toLowerCase();
    if (
      roleLower.includes("tenant") ||
      roleLower.includes("lessee") ||
      roleLower.includes("مستأجر")
    ) {
      ownerRole = "lessee";
      ownerRoleLabel = "المستأجر";
    } else if (roleLower.includes("broker") || roleLower.includes("وسيط")) {
      ownerRole = "broker";
      ownerRoleLabel = "وسيط عقاري";
    } else if (
      roleLower.includes("landlord") ||
      roleLower.includes("lessor") ||
      roleLower.includes("مؤجر")
    ) {
      ownerRole = "lessor";
      ownerRoleLabel = "المؤجر";
    } else {
      ownerRole = rawRole as ContractOwner["role"];
      ownerRoleLabel = rawRole;
    }
  }

  const owner: ContractOwner = {
    id: String(dto.createdBy || creatorParty?.id || lessor.idNumber || "usr-1"),
    name: creatorParty?.name || lessor.name || "مالك العقد",
    email: creatorParty?.email || lessor.email || "—",
    phone: creatorParty?.phone || lessor.phone || "—",
    role: ownerRole,
    roleLabel: ownerRoleLabel,
    idNumber: creatorParty?.nationalId || lessor.idNumber,
    idTypeLabel: lessor.idTypeLabel,
    verifiedViaNafath: creatorParty?.verifiedViaNafath ?? true,
    createdAt: dto.createdAt,
  };

  return {
    id: dto.uuid || String(dto.id),
    contractNumber: dto.contractNumber || `CTR-${dto.id}`,
    type,
    typeLabel,
    status,
    statusLabel,
    statusVariant,
    statusColorClass,
    startDate: dto.terms?.startDate || dto.createdAt?.slice(0, 10) || "—",
    endDate: dto.terms?.endDate || "—",
    durationMonths,
    autoRenewal: dto.terms?.autoRenewal ?? false,
    createdAt: dto.createdAt || new Date().toISOString(),
    updatedAt: dto.updatedAt || new Date().toISOString(),
    owner,
    lessor,
    lessee,
    broker,
    property,
    financials,
    ejar,
    termsAndConditions: [
      "يلتزم المستأجر بسداد القيمة الإيجارية في المواعيد المحددة بالعقد دون تأخير.",
      "يلتزم المؤجر بتسليم الوحدة الإيجارية صالحة للانتفاع ومطابقة للمواصفات المتفق عليها.",
      "يتحمل المستأجر تكاليف استهلاك الكهرباء والمياه والخدمات الخاصة بالوحدة خلال سريان العقد.",
      "يخضع هذا العقد لجميع الأنظمة واللوائح والقرارات الصادرة من الهيئة العامة للعقار وشبكة إيجار.",
    ],
    customTerms: dto.terms?.additionalTerms
      ? [dto.terms.additionalTerms]
      : undefined,
    notes: undefined,
    historyLogs,
  };
}
